#!/bin/bash

source scriptUtils.sh

CHANNEL_NAME=${1:-"hospitalchannel"}
CC_NAME=${2:-"patient"}
CC_SRC_PATH=${3:-"NA"}
CC_SRC_LANGUAGE=${4:-"javascript"}
CC_VERSION=${5:-"1.0"}
CC_SEQUENCE=${6:-"1"}
CC_INIT_FCN=${7:-"initLedger"}
CC_END_POLICY=${8:-"NA"}
CC_COLL_CONFIG=${9:-"../../private-collections/private-collections.json"}
DELAY=${10:-"3"}
MAX_RETRY=${11:-"5"}
VERBOSE=${12:-"false"}
HOSP3=${13:-"false"}

println "executing with the following"
println "- CHANNEL_NAME: ${C_GREEN}${CHANNEL_NAME}${C_RESET}"
println "- CC_NAME: ${C_GREEN}${CC_NAME}${C_RESET}"
println "- CC_SRC_PATH: ${C_GREEN}${CC_SRC_PATH}${C_RESET}"
println "- CC_SRC_LANGUAGE: ${C_GREEN}${CC_SRC_LANGUAGE}${C_RESET}"
println "- CC_VERSION: ${C_GREEN}${CC_VERSION}${C_RESET}"
println "- CC_SEQUENCE: ${C_GREEN}${CC_SEQUENCE}${C_RESET}"
println "- CC_END_POLICY: ${C_GREEN}${CC_END_POLICY}${C_RESET}"
println "- CC_COLL_CONFIG: ${C_GREEN}${CC_COLL_CONFIG}${C_RESET}"
println "- CC_INIT_FCN: ${C_GREEN}${CC_INIT_FCN}${C_RESET}"
println "- DELAY: ${C_GREEN}${DELAY}${C_RESET}"
println "- MAX_RETRY: ${C_GREEN}${MAX_RETRY}${C_RESET}"
println "- VERBOSE: ${C_GREEN}${VERBOSE}${C_RESET}"
println "- HOSP3: ${C_GREEN}${HOSP3}${C_RESET}"

CC_SRC_LANGUAGE=$(echo "$CC_SRC_LANGUAGE" | tr [:upper:] [:lower:])

FABRIC_CFG_PATH=$PWD/../config/

# User has not provided a path, therefore the CC_NAME must
# be the short name of a known chaincode sample
if [ "$CC_SRC_PATH" = "NA" ]; then
  infoln "Determining the path to the chaincode"
  # first see which chaincode we have. This will be based on the
  # short name of the known chaincode sample
  if [ "$CC_NAME" = "patient" ]; then
    println $'\e[0;32m'patient-asset-transfer$'\e[0m' chaincode
    CC_SRC_PATH="../patient-asset-transfer"
  else
    fatalln "The chaincode name ${CC_NAME} is not supported by this script. Supported chaincode names are: patient, etc.,"
  fi

  CC_SRC_PATH="$CC_SRC_PATH/chaincode/"

## Make sure that the path the chaincode exists if provided
elif [ ! -d "$CC_SRC_PATH" ]; then
  fatalln "Path to chaincode does not exist. Please provide different path"
fi

# do some language specific preparation to the chaincode before packaging
CC_RUNTIME_LANGUAGE=node

INIT_REQUIRED="--init-required"
# check if the init fcn should be called
if [ "$CC_INIT_FCN" = "NA" ]; then
  INIT_REQUIRED=""
fi

if [ "$CC_END_POLICY" = "NA" ]; then
  CC_END_POLICY=""
else
  CC_END_POLICY="--signature-policy $CC_END_POLICY"
fi

if [ "$CC_COLL_CONFIG" = "NA" ]; then
  CC_COLL_CONFIG=""
else
  CC_COLL_CONFIG="--collections-config $CC_COLL_CONFIG"
fi

# import utils
. scripts/envVar.sh

packageChaincode() {
  set -x
  peer lifecycle chaincode package ${CC_NAME}.tar.gz --path ${CC_SRC_PATH} --lang ${CC_RUNTIME_LANGUAGE} --label ${CC_NAME}_${CC_VERSION} >&log.txt
  res=$?
  { set +x; } 2>/dev/null
  cat log.txt
  verifyResult $res "Chaincode packaging has failed"
  successln "Chaincode is packaged"
}

# installChaincode PEER ORG
installChaincode() {
  ORG=$1
  setGlobals $ORG
  set -x
  peer lifecycle chaincode install ${CC_NAME}.tar.gz >&log.txt
  res=$?
  { set +x; } 2>/dev/null
  cat log.txt
  verifyResult $res "Chaincode installation on peer0.hosp${ORG} has failed"
  successln "Chaincode is installed on peer0.hosp${ORG}"
}

# queryInstalled PEER ORG
queryInstalled() {
  ORG=$1
  setGlobals $ORG
  set -x
  peer lifecycle chaincode queryinstalled >&log.txt
  res=$?
  { set +x; } 2>/dev/null
  cat log.txt
  PACKAGE_ID=$(sed -n "/${CC_NAME}_${CC_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
  verifyResult $res "Query installed on peer0.hosp${ORG} has failed"
  successln "Query installed successful on peer0.hosp${ORG} on channel"
}

# approveForMyOrg VERSION PEER ORG
approveForMyOrg() {
  ORG=$1
  setGlobals $ORG
  set -x
  peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.lithium.com --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${CC_VERSION} --package-id ${PACKAGE_ID} --sequence ${CC_SEQUENCE} ${INIT_REQUIRED} ${CC_END_POLICY} ${CC_COLL_CONFIG} >&log.txt
  res=$?
  { set +x; } 2>/dev/null
  cat log.txt
  verifyResult $res "Chaincode definition approved on peer0.hosp${ORG} on channel '$CHANNEL_NAME' failed"
  successln "Chaincode definition approved on peer0.hosp${ORG} on channel '$CHANNEL_NAME'"
}

# checkCommitReadiness VERSION PEER ORG
checkCommitReadiness() {
  ORG=$1
  shift 1
  setGlobals $ORG
  infoln "Checking the commit readiness of the chaincode definition on peer0.hosp${ORG} on channel '$CHANNEL_NAME'..."
  local rc=1
  local COUNTER=1
  # continue to poll
  # we either get a successful response, or reach MAX RETRY
  while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ]; do
    sleep $DELAY
    infoln "Attempting to check the commit readiness of the chaincode definition on peer0.hosp${ORG}, Retry after $DELAY seconds."
    set -x
    peer lifecycle chaincode checkcommitreadiness --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${CC_VERSION} --sequence ${CC_SEQUENCE} ${INIT_REQUIRED} ${CC_END_POLICY} ${CC_COLL_CONFIG} --output json >&log.txt
    res=$?
    { set +x; } 2>/dev/null
    let rc=0
    for var in "$@"; do
      grep "$var" log.txt &>/dev/null || let rc=1
    done
    COUNTER=$(expr $COUNTER + 1)
  done
  cat log.txt
  if test $rc -eq 0; then
    infoln "Checking the commit readiness of the chaincode definition successful on peer0.hosp${ORG} on channel '$CHANNEL_NAME'"
  else
    fatalln "After $MAX_RETRY attempts, Check commit readiness result on peer0.hosp${ORG} is INVALID!"
  fi
}

# commitChaincodeDefinition VERSION PEER ORG (PEER ORG)...
commitChaincodeDefinition() {
  parsePeerConnectionParameters $@
  res=$?
  verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "

  # while 'peer chaincode' command can get the orderer endpoint from the
  # peer (if join was successful), let's supply it directly as we know
  # it using the "-o" option
  set -x
  peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.lithium.com --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CC_NAME} $PEER_CONN_PARMS --version ${CC_VERSION} --sequence ${CC_SEQUENCE} ${INIT_REQUIRED} ${CC_END_POLICY} ${CC_COLL_CONFIG} >&log.txt
  res=$?
  { set +x; } 2>/dev/null
  cat log.txt
  verifyResult $res "Chaincode definition commit failed on peer0.hosp${ORG} on channel '$CHANNEL_NAME' failed"
  successln "Chaincode definition committed on channel '$CHANNEL_NAME'"
}

# queryCommitted ORG
queryCommitted() {
  ORG=$1
  setGlobals $ORG
  EXPECTED_RESULT="Version: ${CC_VERSION}, Sequence: ${CC_SEQUENCE}, Endorsement Plugin: escc, Validation Plugin: vscc"
  infoln "Querying chaincode definition on peer0.hosp${ORG} on channel '$CHANNEL_NAME'..."
  local rc=1
  local COUNTER=1
  # continue to poll
  # we either get a successful response, or reach MAX RETRY
  while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ]; do
    sleep $DELAY
    infoln "Attempting to Query committed status on peer0.hosp${ORG}, Retry after $DELAY seconds."
    set -x
    peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name ${CC_NAME} >&log.txt
    res=$?
    { set +x; } 2>/dev/null
    test $res -eq 0 && VALUE=$(cat log.txt | grep -o '^Version: '$CC_VERSION', Sequence: [0-9]*, Endorsement Plugin: escc, Validation Plugin: vscc')
    test "$VALUE" = "$EXPECTED_RESULT" && let rc=0
    COUNTER=$(expr $COUNTER + 1)
  done
  cat log.txt
  if test $rc -eq 0; then
    successln "Query chaincode definition successful on peer0.hosp${ORG} on channel '$CHANNEL_NAME'"
  else
    fatalln "After $MAX_RETRY attempts, Query chaincode definition result on peer0.hosp${ORG} is INVALID!"
  fi
}

chaincodeInvokeInit() {
  parsePeerConnectionParameters $@
  res=$?
  verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "

  # while 'peer chaincode' command can get the orderer endpoint from the
  # peer (if join was successful), let's supply it directly as we know
  # it using the "-o" option
  set -x
  fcn_call='{"function":"'${CC_INIT_FCN}'","Args":[]}'
  infoln "invoke fcn call:${fcn_call}"
  peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.lithium.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n ${CC_NAME} $PEER_CONN_PARMS --isInit -c ${fcn_call} >&log.txt
  res=$?
  { set +x; } 2>/dev/null
  cat log.txt
  verifyResult $res "Invoke execution on $PEERS failed "
  successln "Invoke transaction successful on $PEERS on channel '$CHANNEL_NAME'"
}

chaincodeQuery() {
  ORG=$1
  setGlobals $ORG
  infoln "Querying on peer0.hosp${ORG} on channel '$CHANNEL_NAME'..."
  local rc=1
  local COUNTER=1
  # continue to poll
  # we either get a successful response, or reach MAX RETRY
  while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ]; do
    sleep $DELAY
    infoln "Attempting to Query peer0.hosp${ORG}, Retry after $DELAY seconds."
    set -x
    peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"Args":["queryAllCars"]}' >&log.txt
    res=$?
    { set +x; } 2>/dev/null
    let rc=$res
    COUNTER=$(expr $COUNTER + 1)
  done
  cat log.txt
  if test $rc -eq 0; then
    successln "Query successful on peer0.hosp${ORG} on channel '$CHANNEL_NAME'"
  else
    fatalln "After $MAX_RETRY attempts, Query result on peer0.hosp${ORG} is INVALID!"
  fi
}

## package the chaincode
packageChaincode

## Install chaincode on peer0.org1 and peer0.org2
infoln "Installing chaincode on peer0.hosp1..."
installChaincode 1
infoln "Install chaincode on peer0.hosp2..."
installChaincode 2
if [ "$HOSP3" = "true" ]; then
  infoln "Install chaincode on peer0.hosp3..."
  installChaincode 3
fi


## query whether the chaincode is installed
queryInstalled 1
## query whether the chaincode is installed
queryInstalled 2
if [ "$HOSP3" = "true" ]; then
  ## query whether the chaincode is installed
  queryInstalled 3
fi

if [ "$HOSP3" = "true" ]; then
  ## approve the definition for hosp1
  approveForMyOrg 1

  ## check whether the chaincode definition is ready to be committed
  ## expect org1 to have approved and org2 not to
  checkCommitReadiness 1 "\"hosp1MSP\": true" "\"hosp2MSP\": false" "\"hosp3MSP\": false"
  checkCommitReadiness 2 "\"hosp1MSP\": true" "\"hosp2MSP\": false" "\"hosp3MSP\": false"
  checkCommitReadiness 3 "\"hosp1MSP\": true" "\"hosp2MSP\": false" "\"hosp3MSP\": false"

  ## now approve also for hosp2
  approveForMyOrg 2

  ## check whether the chaincode definition is ready to be committed
  ## expect them both to have approved
  checkCommitReadiness 1 "\"hosp1MSP\": true" "\"hosp2MSP\": true" "\"hosp3MSP\": false"
  checkCommitReadiness 2 "\"hosp1MSP\": true" "\"hosp2MSP\": true" "\"hosp3MSP\": false"
  checkCommitReadiness 3 "\"hosp1MSP\": true" "\"hosp2MSP\": true" "\"hosp3MSP\": false"

  ## now approve also for hosp3
  approveForMyOrg 3

  ## check whether the chaincode definition is ready to be committed
  ## expect them both to have approved
  checkCommitReadiness 1 "\"hosp1MSP\": true" "\"hosp2MSP\": true" "\"hosp3MSP\": true"
  checkCommitReadiness 2 "\"hosp1MSP\": true" "\"hosp2MSP\": true" "\"hosp3MSP\": true"
  checkCommitReadiness 3 "\"hosp1MSP\": true" "\"hosp2MSP\": true" "\"hosp3MSP\": true"

  ## now that we know for sure both orgs have approved, commit the definition
  commitChaincodeDefinition 1 2 3
else
  ## approve the definition for hosp1
  approveForMyOrg 1

  ## check whether the chaincode definition is ready to be committed
  ## expect org1 to have approved and org2 not to
  checkCommitReadiness 1 "\"hosp1MSP\": true" "\"hosp2MSP\": false"
  checkCommitReadiness 2 "\"hosp1MSP\": true" "\"hosp2MSP\": false"
  #checkCommitReadiness 3 "\"hosp1MSP\": true" "\"hosp2MSP\": false" "\"hosp3MSP\": false"

  ## now approve also for hosp2
  approveForMyOrg 2

  ## check whether the chaincode definition is ready to be committed
  ## expect them both to have approved
  checkCommitReadiness 1 "\"hosp1MSP\": true" "\"hosp2MSP\": true"
  checkCommitReadiness 2 "\"hosp1MSP\": true" "\"hosp2MSP\": true"

  ## now that we know for sure both orgs have approved, commit the definition
  commitChaincodeDefinition 1 2
fi

## query on both orgs to see that the definition committed successfully
queryCommitted 1
queryCommitted 2
if [ "$HOSP3" = "true" ]; then
  queryCommitted 3
fi

## Invoke the chaincode - this does require that the chaincode have the 'initLedger'
## method defined
if [ "$CC_INIT_FCN" = "NA" ]; then
  infoln "Chaincode initialization is not required"
else
  chaincodeInvokeInit 1 2
fi

exit 0
