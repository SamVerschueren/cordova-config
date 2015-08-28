'use strict';

/**
 * Test suite for cordova-config
 * 
 * @author Sam Verschueren      <sam.verschueren@gmail.com>
 * @since  28 Aug. 2015
 */

// module dependencies
var chai = require('chai');

var Config = require('../');

// use should flavour
var should = chai.should();

describe('cordova-config', function() {
    
    describe('parsing', function() {
        
        it('Should throw an error if the file could not be found', function(cb) {
            try {
                new Config('config.xml');
            }
            catch(e) {
                should.exist(e);
                cb();
            }
        });
        
        it('Should throw an error if the root tag is not <widget>', function(cb) {
            try {
                new Config(__dirname + '/fixtures/config.wrong.xml');
            }
            catch(e) {
                should.exist(e);
                cb();
            }
        });
        
        it('Should parse the config file correctly', function(cb) {
            var config = new Config(__dirname + '/fixtures/config.xml');
            
            config._root.tag.should.be.equal('widget');
            config._root.attrib.id.should.be.equal('cordova-config');
            config._root.attrib.version.should.be.equal('0.0.1');
            config._root._children.should.have.length(5);
            
            cb();
        });
        
        it('Should remove the Byte Order Mark', function(cb) {
            var config = new Config(__dirname + '/fixtures/config.bom.xml');
            
            config._root.tag.should.be.equal('widget');
            config._root.attrib.id.should.be.equal('cordova-config');
            config._root.attrib.version.should.be.equal('0.0.1');
            config._root._children.should.have.length(5);
            
            cb();
        });
    });
});