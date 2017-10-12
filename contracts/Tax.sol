pragma solidity ^0.4.2;

contract Tax {
    struct CostBreakdown {
        uint total;
        uint tax;
        uint fee;
    }
    mapping (bytes32 => CostBreakdown) uniqueTransactionToCostBreakdown;
    mapping (address => uint) relationshipHashToNumberOfTransactions;

    function Send (address customer, address _seller, uint cost) {
        uint lastTransactionId = relationshipHashToNumberOfTransactions[customer];
        relationshipHashToNumberOfTransactions[customer] = lastTransactionId + 1;
        bytes32 hash = calculateTransactionIdHash(customer, lastTransactionId + 1);
        WriteFeeTaxAndTransaction(cost, hash);
        // _seller.transfer(cost / 5);
    }

    function getLastTransactionNumber(address user) constant returns(uint) {
        return relationshipHashToNumberOfTransactions[user];
    }

    function WriteFeeTaxAndTransaction(uint transaction, bytes32 transactionHash) {
        uint totalRemoved = transaction / 5;
        uint tax = (9*totalRemoved) /10;
        uint fee = totalRemoved /10;
        uniqueTransactionToCostBreakdown[transactionHash].total = transaction;
        uniqueTransactionToCostBreakdown[transactionHash].tax = tax;
        uniqueTransactionToCostBreakdown[transactionHash].fee = fee;
    }

    function calculateTransactionIdHash(address customerAddress, uint transactionNum) constant returns(bytes32) {
        return sha3(customerAddress, transactionNum);
    }

    function ReadTaxForCurrent(bytes32 transactionIdHash) constant returns(uint) {
        return uniqueTransactionToCostBreakdown[transactionIdHash].tax;
    }

    function ReadFeeForCurrent(bytes32 transactionIdHash) constant returns(uint) {
        return uniqueTransactionToCostBreakdown[transactionIdHash].fee;
    }

    function ReadTotalForCurrent(bytes32 transactionIdHash) constant returns(uint) {
        return uniqueTransactionToCostBreakdown[transactionIdHash].total;
    }
}
