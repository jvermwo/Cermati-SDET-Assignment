const supertest = require("supertest");
const expect = require("chai").expect;
const UtilityFunction_spec = require('./UtilityFunction_spec');
const { config } = require('./config');


describe("Spark Offers Flow: ", function () {
    this.timeout(200000);
    let expectedReverseData = {
        status: '00',
        description: 'OK',
        settlementDate: dateFns.getTodayDateISOString(),
        fundingSource: 'SBSLEPAYGPR'
    };
    let uuid, access_token, txnRefNo1;
    let offerId = testData[0][config.env].offerId;
    let merchantId = testData[0][config.env].sparkMerchantId;
    let channel = testData[0][config.env].channel;
    let merchantName = testData[0][config.env].sparkMerchantName;
    let authorizationForFAQs = testData[0][config.env].authorizationForFAQs;
    let articleId = testData[0][config.env].articleIdforSpark;
    let mcc = "0101";
    let trnAmount = 500;
    let creditBalBeforeTrn, actualcashbackAmount;
    let reverseData = {
        settlementDate: dateFns.getTodayDateISOString(),
        status: '00',
        description: 'OK'
    };

    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    before(async function () {
        await login.userLogin(testData[0][config.env].sparkOfferMail, "2580").then(async function (obj) {
            if (obj.success) {
                access_token = obj.uAccessToken;
                uuid = obj.uuid;
                expect(obj.success).to.eql(true);
                await commonDBFns.fetchUserDetails(uuid).then(async function (applicaionData) {
                    await retentiondbFuns.deleteGeneratedUserOffersCountUuid(uuid);
                    await retentiondbFuns.deleteGeneratedUserOffersUuid(uuid);
                    await commonDBFns.removeSparkActivateEntry(uuid);
                    await commonDBFns.fetchUserDetails(uuid).then(function (uuidData) {
                        creditBalBeforeTrn = uuidData[0].creditBalance;
                    })
                    await cardFns.fetchMiniWalletBalance(access_token).then(function (objResponse) {
                        let walletBalance = objResponse.body.data.ui.header;
                        walletBalanceBeforeTxn = parseFloat((walletBalance.split(",").join("").substring(1, 10)));

                    })
                    if (applicaionData.length) {
                        expect(applicaionData[0]).to.have.property("uuid");
                    } else {
                        expect(applicaionData[0]).to.have.property("uuid");
                    }
                })
            } else {
                expect(obj.success).to.eql(false);
            }
        })
    });

    it("Should able to activate spark offer from slice app", async function () {
        var _this = this;
        var offerId = "62f3972792780dda8c5dd2f4";
        var merchantName = "Decathlon";
        await retentionFns.activateSparkOffers(offerId, access_token)
            .then(async function (response) {
                expect(response.success).to.eql(true);
                expect(response.body.data.selectedOffer.headerTitle.text).to.eql(merchantName);
                expect(response.body.data.selectedOffer.bottomPage.bottomCta.ctaText).to.eql('Deactivate spark');
                expect(response.body.data.selectedOffer.headerDesc.text).to.eql('Get 10% cashback');
                addContext(_this, "Checked text as Get 10% cashback");

            })
    });

    it("Should able to validate spark list from slice app", async function () {
        await retentionFns.sparkList(access_token, uuid)
            .then(async function (response) {
                expect(response.body.success).to.eql(true);
                expect(response.body.data.title).to.eql("spark");
                expect(response.body.data.selectedOffer.selected).to.eql(true);
                expect(response.body.data.cardDetails.cardType).to.eql("mini");
            })
    });


    /* if offer countMax count is 1 and once the user has paid the bill to the merchant, the spark offers will be automatically deactivated */
    it("Should able to do spark offer transaction with specific merchant", async function () {
        var _this = this;
        let channel = "ECOM", transactionType = channel;
        let dataObj1 = {
            settlementDate: dateFns.getTodayDateISOString(),
            currencyCode: 'INR',
            status: '00',
            description: 'Authorized',
            "fundingSource": "SBSLEPAYGPR"
        };
        //fetching spark offer data from offers Collection
        await retentiondbFuns.fetchOfferDetails(merchantName).then(async function (offerData) {
            cashbackPercent = offerData[0].percentage;
            sparkOfferExpiryDate = offerData[0].endDate;
            actualcashbackAmount = cashbackPercent * trnAmount / 100;

        })
        const debitTxn_Payload = await miniCardTxn(uuid, trnAmount, transactionType, transactionType, channel, merchantId, merchantName, mcc)
        await cardFns.debitTransaction(debitTxn_Payload)
            .then(async function (response) {
                txnRefNo1 = response.body.txnRefNo;
                expect(response.status).to.eql(true);
                addContext(_this, "Checked success as true");
                expect(response.body).to.deep.include(dataObj1);
                addContext(_this, "Checked as currencyCode: 'INR', status: '00', description: 'Authorized',settlementDate:" + dateFns.getTodayDateISOString());
                await sleep(4000);
                //fetching spark offer data from userOffer Collection
                await retentiondbFuns.fetchUserOffersData(uuid).then(async function (sparkData) {

                    expect(sparkData[0].cashbackAmount).to.eql(actualcashbackAmount);
                    addContext(_this, "Checked cashbackAmount as" + actualcashbackAmount);

                    expect(sparkData[0].merchant.name).to.eql(merchantName);
                    addContext(_this, "Checked merchantName as" + merchantName);

                    expect(sparkData[0].type).to.eql("generic");
                    addContext(_this, "Checked spark offer type as" + sparkData[0].type);

                    expect(sparkData[0].sparkApplied).to.eql(true);
                    addContext(_this, "Checked sparkApplied as" + sparkData[0].sparkApplied);

                })
            })
    })

    //Verify debit transaction details in passbook
    it("Should be able to verify spark offer transaction in Slice Mini Passbook", async function () {
        this.retries(10);
        await sleep(5000)
        await cardFns.sliceMinipassbookPageDetails(access_token).then(async function (response) {
            //Spark Cashback Checking
            expect(response.body.data.activities[0].activityStatus).to.eql('SUCCESS');
            expect(response.body.data.activities[0].type).to.eql('credit');
            expect(response.body.data.activities[0].displayAmountDetail.amountWithoutCurrency).to.eql(actualcashbackAmount);
            // Transaction Amount Checking
            expect(response.body.data.activities[1].activityStatus).to.eql('SUCCESS');
            expect(response.body.data.activities[1].type).to.eql('debit');
            expect(response.body.data.activities[1].displayAmountDetail.amountWithoutCurrency).to.eql(trnAmount);
            await cardFns.fetchMiniWalletBalance(access_token).then(function (objResponse) {
                let walletBalance = objResponse.body.data.ui.header;
                let walletBalanceAfterTxn = parseFloat((walletBalance.split(",").join("").substring(1, 10)));
                expect(walletBalanceAfterTxn + trnAmount - actualcashbackAmount).to.eql(walletBalanceBeforeTxn)

            })
        })
    })


    it("SLC: Should able to do sparkOffer reverse txn with channel", async function () {
        var _this = this;
        const reverseTxn_Payload = await miniReverseTxn(uuid, trnAmount, txnRefNo1, channel, merchantId, merchantName, mcc)
        await cardFns.ReverseTransaction(reverseTxn_Payload)
            .then(async function (objResponse) {
                expect(objResponse.body).to.deep.include(expectedReverseData);
                await sleep(4000);
            })
    })

    xit("SLC: Should able to check reverse details in db", async function () {
        this.retries(10);
        var _this = this;
        // //Fetch Trxn Data from MZ
        // await dbFns.fetchTxnsData(txnRefNo, txnType).then(async function (reverseTrxnData) {
        //     expect(reverseTrxnData[0].transactionStatus).to.eql("REVERSED")

        //fetching txns entries from qaudDb
        // await dbFns.fetchTxnsData_Quad(txnRefNo, txnType).then(async function (reverseTrxnDataQuad) {
        //     expect(reverseTrxnDataQuad[0].transactionStatus).to.eql("REVERSED")
        //     //fetching spark offer data from userOffer Collection
        //     await retentiondbFuns.fetchUserOffersData(uuid).then(async function (sparkUserOfferData) {
        //         expect(sparkUserOfferData[0].cashbackAmount).to.eql(actualcashbackAmount);
        //         addContext(_this, "Checked cashbackAmount as" + actualcashbackAmount);
        //         expect(sparkUserOfferData[0].merchant.name).to.eql(merchantName);
        //         addContext(_this, "Checked topMerchantName as" + merchantName);
        //         expect(sparkUserOfferData[0].offerExpiryDate).to.eql(sparkOfferExpiryDate);
        //         addContext(_this, "Checked offerExpiryDate as " + sparkOfferExpiryDate);
        //         expect(sparkUserOfferData[0].type).to.eql('generic');
        //         addContext(_this, "Checked type as " + sparkUserOfferData[0].type);
        //         expect(sparkUserOfferData[0].sparkApplied).to.eql(true);
        //         addContext(_this, "Checked topOfferApplied as" + sparkUserOfferData[0].sparkApplied);
        //     })
        // })
    })

    it("Should be able to verify reverse transaction of spark in slice mini passbook", async function () {
        this.retries(10);
        await sleep(4000)
        //fetching top spark cashback and txn amount from passbookList
        await cardFns.sliceMinipassbookPageDetails(access_token).then(async function (response) {
            //Spark Cashback Reversed
            expect(response.body.data.activities[0].activityStatus).to.eql('REVERSED');
            expect(response.body.data.activities[0].type).to.eql('credit');
            expect(response.body.data.activities[0].displayAmountDetail.amountWithoutCurrency).to.eql(actualcashbackAmount);
            // Transaction Amount Reversed
            expect(response.body.data.activities[1].activityStatus).to.eql('REVERSED');
            expect(response.body.data.activities[1].type).to.eql('debit');
            expect(response.body.data.activities[1].displayAmountDetail.amountWithoutCurrency).to.eql(trnAmount);
            await commonDBFns.fetchUserDetails(uuid).then(function (uuidData) {
                creditBalAfterTrn = uuidData[0].creditBalance;
                expect(creditBalAfterTrn).to.eql(creditBalBeforeTrn);
            })
        })
    })

    //Deactivate spark offer  
    it("Should able to deactive spark offer from slice app", async function () {
        var offerId = "62f3972792780dda8c5dd2f4";
        await retentionFns.deactivateSparkOffers(offerId, access_token, uuid)
            .then(async function (response) {
                expect(response.success).to.eql(true);
                expect(response.body.data.removedOffer.offerId).to.eql(offerId);
            })
    });

    //article id is a reference number for an article on freshdesk
    it("Should able to check FAQs of Spark using ArticleId", async function () {
        var _this = this;
        await retentionFns.FAQsForSpark(access_token, articleId, uuid, authorizationForFAQs)
            .then(async function (response) {
                expect(response.success).to.eql(true);
            })
    });

})
