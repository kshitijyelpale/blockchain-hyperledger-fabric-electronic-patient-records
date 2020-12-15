# Create organization

- In network.sh of the test-network, we see createOrgs. 
- The netowrk.sh in this folder has been modified, so that when the organization name is passed to the function, organization is created.

## Prerequisties
1. As this script using cryptogen, first check YAML file in organisations/cryptogen directory. The file must look something like
```yaml
PeerOrgs:
  - Name: HospitalA
    Domain: hospA.example.com
    EnableNodeOUs: true
    
    # This count represents the number of peers for that organization
    Template:
      Count: 1
      SANS:
        - localhost
    Users:
      Count: 1
```

2. So based on the YAML file, the organization peers are created along with the certificates.

## Usage of network.sh
1. myCreateOrg is the new function that has been added to network.sh
2. Execute network.sh as usual. 
3. This script JUST creates organisation and its peers. And provides certificates.
4. The YAML files have been configured to
    - Create two organization Hospital A and Hospital B
    - Hospital A has one peer
    - Hospital B has two peers
    - Certifcates provided to all using cryptogen
5. After running, you can check by seeing two new directories that get created peerOrganizations and ordererOrganizations
