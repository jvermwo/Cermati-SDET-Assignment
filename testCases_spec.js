const supertest = require("supertest");
const expect = require("chai").expect;
const UtilityFunction_spec = require('./UtilityFunction_spec');
const { config } = require('./config');


describe("Spark Offers Flow: ", function () {
    this.timeout(200000);
    
it("Should able to verify that the page loads completely.", async function () {
        await UtilityFunction_spec.activateSparkOffers(offerId, access_token)
            .then(async function (response) {
                expect(response.success).to.eql(true);
                expect(response.body.data.selectedOffer.headerTitle.text).to.eql(merchantName);
                expect(response.body.data.selectedOffer.bottomPage.bottomCta.ctaText).to.eql('Deactivate spark');
                expect(response.body.data.selectedOffer.headerDesc.text).to.eql('Get 10% cashback');
                addContext(_this, "Checked text as Get 10% cashback");

            })
    });

 })
