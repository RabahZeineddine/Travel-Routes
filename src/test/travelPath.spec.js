let chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const should = chai.should();
chai.use(chaiHttp);


describe("Routes test", function () {

    describe("Get route without registered input", function () {
        it("Should not find any route invoking a 404 error as input file not found", function (done) {
            chai.request(server)
                .get('/v1/path/GRU-CDG')
                .end((err, res) => {
                    res.should.have.status(404)
                    done()
                })
        })
    })


    describe("Add Routes", function () {


        it('Should throw error adding a Route without cost: GRU-BRC', function (done) {
            chai.request(server)
                .post('/v1/path')
                .send({
                    from: 'GRU', to: 'BRC'
                })
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.should.have.property('message').equal('ValidationError: "cost" is required')
                    done()
                })
        })
        it("Should add a new Route: GRU,BRC,10", function (done) {
            chai.request(server)
                .post('/v1/path')
                .send({ from: 'GRU', to: 'BRC', cost: 10 })
                .end((err, res) => {
                    res.should.have.status(201)
                    done()
                })
        })

        it("Should add a new Route: BRC,SCL,5", function (done) {
            chai.request(server)
                .post('/v1/path')
                .send({ from: 'BRC', to: 'SCL', cost: 5 })
                .end((err, res) => {
                    res.should.have.status(201)
                    done()
                })
        })

        it("Should add a new Route: GRU,CDG,75", function (done) {
            chai.request(server)
                .post('/v1/path')
                .send({ from: 'GRU', to: 'CDG', cost: 75 })
                .end((err, res) => {
                    res.should.have.status(201)
                    done()
                })
        })

        it("Should add a new Route: GRU,SCL,20", function (done) {
            chai.request(server)
                .post('/v1/path')
                .send({ from: 'GRU', to: 'SCL', cost: 20 })
                .end((err, res) => {
                    res.should.have.status(201)
                    done()
                })
        })

        it("Should add a new Route: GRU,ORL,56", function (done) {
            chai.request(server)
                .post('/v1/path')
                .send({ from: 'GRU', to: 'ORL', cost: 56 })
                .end((err, res) => {
                    res.should.have.status(201)
                    done()
                })
        })

        it("Should add a new Route: ORL,CDG,5", function (done) {
            chai.request(server)
                .post('/v1/path')
                .send({ from: 'ORL', to: 'CDG', cost: 5 })
                .end((err, res) => {
                    res.should.have.status(201)
                    done()
                })
        })

        it("Should add a new Route: SCL,ORL,20", function (done) {
            chai.request(server)
                .post('/v1/path')
                .send({ from: 'SCL', to: 'ORL', cost: 20 })
                .end((err, res) => {
                    res.should.have.status(201)
                    done()
                })
        })

    })

    describe("Find Routes", function () {
        it("Should find a shortest path GRU-BRC: GRU-BRC-SCL-ORL-CDG > 40", function (done) {
            chai.request(server)
                .get('/v1/path/GRU-CDG')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.have.property('message').equal('GRU - BRC - SCL - ORL - CDG > 40')
                    done()
                })
        })

        it("Should not find any path for: GRU-BEY", function (done) {
            chai.request(server)
                .get('/v1/path/GRU-BEY')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.have.property("message").equal("There is no path available!")
                    done()
                })
        })
    })
})
