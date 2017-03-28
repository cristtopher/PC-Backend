'use strict';

var app = require('../..');
import request from 'supertest';

var newPerson;

describe('Person API:', function() {
  describe('GET /api/people', function() {
    var people;

    beforeEach(function(done) {
      request(app)
        .get('/api/people')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          people = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(people).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/people', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/people')
        .send({
          name: 'New Person',
          info: 'This is the brand new person!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newPerson = res.body;
          done();
        });
    });

    it('should respond with the newly created person', function() {
      expect(newPerson.name).to.equal('New Person');
      expect(newPerson.info).to.equal('This is the brand new person!!!');
    });
  });

  describe('GET /api/people/:id', function() {
    var person;

    beforeEach(function(done) {
      request(app)
        .get(`/api/people/${newPerson._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          person = res.body;
          done();
        });
    });

    afterEach(function() {
      person = {};
    });

    it('should respond with the requested person', function() {
      expect(person.name).to.equal('New Person');
      expect(person.info).to.equal('This is the brand new person!!!');
    });
  });

  describe('PUT /api/people/:id', function() {
    var updatedPerson;

    beforeEach(function(done) {
      request(app)
        .put(`/api/people/${newPerson._id}`)
        .send({
          name: 'Updated Person',
          info: 'This is the updated person!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedPerson = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPerson = {};
    });

    it('should respond with the original person', function() {
      expect(updatedPerson.name).to.equal('New Person');
      expect(updatedPerson.info).to.equal('This is the brand new person!!!');
    });

    it('should respond with the updated person on a subsequent GET', function(done) {
      request(app)
        .get(`/api/people/${newPerson._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let person = res.body;

          expect(person.name).to.equal('Updated Person');
          expect(person.info).to.equal('This is the updated person!!!');

          done();
        });
    });
  });

  describe('PATCH /api/people/:id', function() {
    var patchedPerson;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/people/${newPerson._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Person' },
          { op: 'replace', path: '/info', value: 'This is the patched person!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedPerson = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedPerson = {};
    });

    it('should respond with the patched person', function() {
      expect(patchedPerson.name).to.equal('Patched Person');
      expect(patchedPerson.info).to.equal('This is the patched person!!!');
    });
  });

  describe('DELETE /api/people/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/people/${newPerson._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when person does not exist', function(done) {
      request(app)
        .delete(`/api/people/${newPerson._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
