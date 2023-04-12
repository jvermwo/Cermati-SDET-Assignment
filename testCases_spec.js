const supertest = require("supertest");
const expect = require("chai").expect;
const UtilityFunction_spec = require('./UtilityFunction_spec');
const { config } = require('./config');


describe("Spark Offers Flow: ", function () {
    this.timeout(200000);
    
   it("Should able to verify that the page loads completely.", async function () {
        await UtilityFunction_spec.ebaySearchAPI()
            .then(async function (response) {
                expect(response.success).to.eql(true);
                expect(response.body.head.title).to.eql("MacBook in Computers/Tablets &amp; Networking for sale | eBay");

        })
    });
    
    it("Should able to verify that the first result name matches with the search string.", async function () {
        var searchString  = "MacBook in Computers/Tablets &amp; Networking for sale | eBay";
        await UtilityFunction_spec.ebaySearchAPI()
            .then(async function (response) {
                expect(response.success).to.eql(true);
                expect(response.body.head.title).to.eql(searchString);

        })
    });

    
    

 })
