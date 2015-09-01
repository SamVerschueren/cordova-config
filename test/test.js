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
        
        it('Should parse the config file correctly', function() {
            var config = new Config(__dirname + '/fixtures/config.xml');
            
            config._root.tag.should.be.equal('widget');
            config._root.attrib.id.should.be.equal('cordova-config');
            config._root.attrib.version.should.be.equal('0.0.1');
            config._root._children.should.have.length(6);
        });
        
        it('Should remove the Byte Order Mark', function() {
            var config = new Config(__dirname + '/fixtures/config.bom.xml');
            
            config._root.tag.should.be.equal('widget');
            config._root.attrib.id.should.be.equal('cordova-config');
            config._root.attrib.version.should.be.equal('0.0.1');
            config._root._children.should.have.length(5);
        });
    });
    
    describe('#setName', function() {
        
        it('Should add a name tag if it does not yet exist', function() {
            // Load the config and set the name
            var config = new Config(__dirname + '/fixtures/config.empty.xml');
            config.setName('FooBar');
            
            // Test
            config._root._children.should.have.length(1);
            config._root._children[0].tag.should.be.equal('name');
            config._root._children[0].text.should.be.equal('FooBar');
        });
        
        it('Should overwrite the name tag if it allready exists', function() {
            // Load the config and set the name
            var config = new Config(__dirname + '/fixtures/config.xml');
            config.setName('FooBar');
            
            // Test
            var element = config._doc.find('./name');
            
            element.tag.should.be.equal('name');
            element.text.should.be.equal('FooBar');
        });
    });
    
    describe('#setDescription', function() {
        
        it('Should add a description tag if it does not yet exist', function() {
            // Load the config and set the description
            var config = new Config(__dirname + '/fixtures/config.empty.xml');
            config.setDescription('Foo Description');
            
            // Test
            config._root._children.should.have.length(1);
            config._root._children[0].tag.should.be.equal('description');
            config._root._children[0].text.should.be.equal('Foo Description');
        });
        
        it('Should overwrite the description tag if it allready exists', function() {
            // Load the config and set the description
            var config = new Config(__dirname + '/fixtures/config.xml');
            config.setDescription('Foo Description');
            
            // Test
            var element = config._doc.find('./description');
            
            element.tag.should.be.equal('description');
            element.text.should.be.equal('Foo Description');
        });
    });
    
    describe('#setAuthor', function() {
        
        it('Should add an author tag with no attributes if only the name is provided', function() {
            // Load the config and set the author
            var config = new Config(__dirname + '/fixtures/config.empty.xml');
            config.setAuthor('John Doe');
            
            // Test
            config._root._children.should.have.length(1);
            config._root._children[0].tag.should.be.equal('author');
            config._root._children[0].text.should.be.equal('John Doe');
            config._root._children[0].attrib.should.be.eql({});
        });
        
        it('Should add an author tag with an email attribute if it is provided', function() {
            // Load the config and set the author
            var config = new Config(__dirname + '/fixtures/config.empty.xml');
            config.setAuthor('John Doe', 'john.doe@testers.com');
            
            // Test
            config._root._children.should.have.length(1);
            config._root._children[0].tag.should.be.equal('author');
            config._root._children[0].text.should.be.equal('John Doe');
            config._root._children[0].attrib.should.be.eql({email: 'john.doe@testers.com'});
        });
        
        it('Should add an author tag with an email and href attribute if it is provided', function() {
            // Load the config and set the author
            var config = new Config(__dirname + '/fixtures/config.empty.xml');
            config.setAuthor('John Doe', 'john.doe@testers.com', 'http://john.doe.com');
            
            // Test
            config._root._children.should.have.length(1);
            config._root._children[0].tag.should.be.equal('author');
            config._root._children[0].text.should.be.equal('John Doe');
            config._root._children[0].attrib.should.be.eql({email: 'john.doe@testers.com', href: 'http://john.doe.com'});
        });
        
        it('Should overwrite the author tag and remove the attributes if only the name is provided', function() {
            // Load the config and set the author
            var config = new Config(__dirname + '/fixtures/config.xml');
            config.setAuthor('John Doe');
            
            // Test
            var element = config._doc.find('./author');
            
            element.tag.should.be.equal('author');
            element.text.should.be.equal('John Doe');
            element.attrib.should.be.eql({});
        });
        
        it('Should overwrite the author tag and remove the href attribute if only the name and email is provided', function() {
            // Load the config and set the author
            var config = new Config(__dirname + '/fixtures/config.xml');
            config.setAuthor('John Doe', 'john.doe@testers.com');
            
            // Test
            var element = config._doc.find('./author');
            
            element.tag.should.be.equal('author');
            element.text.should.be.equal('John Doe');
            element.attrib.should.be.eql({email: 'john.doe@testers.com'});
        });
        
        it('Should overwrite the author tag and attributes', function() {
            // Load the config and set the author
            var config = new Config(__dirname + '/fixtures/config.xml');
            config.setAuthor('John Doe', 'john.doe@testers.com', 'http://john.doe.com');
            
            // Test
            var element = config._doc.find('./author');
            
            element.tag.should.be.equal('author');
            element.text.should.be.equal('John Doe');
            element.attrib.should.be.eql({email: 'john.doe@testers.com', href: 'http://john.doe.com'});
        });
    });
    
    describe('#setVersion', function() {
        
        it('Should throw an error if the version equals ab', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');
            
            config.setVersion.bind(config, 'ab').should.throw(Error);
        });
        
        it('Should throw an error if the version equals 1', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');
            
            config.setVersion.bind(config, '1').should.throw(Error);
        });
        
        it('Should throw an error if the version equals 1.1', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');
            
            config.setVersion.bind(config, '1.1').should.throw(Error);
        });
        
        it('Should not throw an error if the version equals 1.1.1', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');
            
            config.setVersion.bind(config, '1.1.1').should.not.throw(Error);
        });
        
        it('Should not throw an error if the version equals 1.1.1.1', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');
            
            config.setVersion.bind(config, '1.1.1.1').should.throw(Error);
        });
        
        it('Should not throw an error if the version equals a.b.c', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');
            
            config.setVersion.bind(config, 'a.b.c').should.throw(Error);
        });
        
        it('Should not throw an error if the version equals 1..1', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');
            
            config.setVersion.bind(config, '1..1').should.throw(Error);
        });
        
        it('Should not throw an error if the version equals 1.1.', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');
            
            config.setVersion.bind(config, '1.1.').should.throw(Error);
        });
        
        it('Should overwrite version of the widget tag', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');
            config.setVersion('1.1.1');
            
            config._root.attrib.version.should.be.equal('1.1.1');
        });
        
        it('Should set the version of the widget tag', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.empty.xml');
            config.setVersion('1.1.1');
            
            config._root.attrib.version.should.be.equal('1.1.1');
        });
    });
    
    describe('#setAndroidVersionCode', function() {
        it('Should throw an error if the version equals ab', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');
            
            config.setAndroidVersionCode.bind(config, 'ab').should.throw(Error);
        });
        
        it('Should not throw an error if the version equals string 1', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');
            
            config.setAndroidVersionCode.bind(config, '1').should.not.throw(Error);
        });
        
        it('Should not throw an error if the version equals number 1', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');
            
            config.setAndroidVersionCode.bind(config, 1).should.not.throw(Error);
        });
        
        it('Should not throw an error if the version equals 1.1', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');
            
            config.setAndroidVersionCode.bind(config, '1.1').should.throw(Error);
        });
        
        it('Should not throw an error if the version equals 1a', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');
            
            config.setAndroidVersionCode.bind(config, '1a').should.throw(Error);
        });
        
        it('Should not throw an error if the version equals a1', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');
            
            config.setAndroidVersionCode.bind(config, 'a1').should.throw(Error);
        });
        
        it('Should overwrite version of the widget tag', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');
            config.setAndroidVersionCode('110');
            
            config._root.attrib['android-versionCode'].should.be.equal('110');
        });
        
        it('Should set the version of the widget tag', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.empty.xml');
            config.setAndroidVersionCode('110');
            
            config._root.attrib['android-versionCode'].should.be.equal('110');
        });
    });
    
    // TODO test setIOSBundleVersion but wait for https://github.com/SamVerschueren/gulp-cordova-version/issues/2 to be resolved
    
    describe('#setPreference', function() {
        it('Should overwrite the preference if it already exists', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');
            config.setPreference('ShowTitle', false);
            
            var preference = config._doc.find('./preference/[@name="ShowTitle"]');
            
            preference.attrib.name.should.be.equal('ShowTitle');
            preference.attrib.value.should.be.equal(false);
        });
        
        it('Should create a new preference if it already exists', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.empty.xml');
            config.setPreference('ShowTitle', false);
            
            var preference = config._doc.find('./preference/[@name="ShowTitle"]');
            
            preference.attrib.name.should.be.equal('ShowTitle');
            preference.attrib.value.should.be.equal(false);
        });
    });
    
    describe('#setID', function() {
        it('Should throw an error if the id has non IRI character', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');

            config.setID.bind(config, '*.wrongid.com').should.throw(Error);
            config.setID.bind(config, '$.wrongid.com').should.throw(Error);
            config.setID.bind(config, '.com.com').should.throw(Error);
        });

        it('Should set the id of the widget tag', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.empty.xml');
            config.setID('com.my.app');

            config._root.attrib['id'].should.be.equal('com.my.app');
        });
    });

    describe('#addHook', function() {
        it('Should throw an error if the type is invalid', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');

            config.addHook.bind(config, 'after_then', 'scripts/hook.js').should.throw(Error);
            config.addHook.bind(config, 'after_compil', 'scripts/hook.js').should.throw(Error);
        });

        it('Should add a hook element on the root', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.empty.xml');
            config.addHook('after_build', 'scripts/hook.js');

            config._doc.find('./hook/[@type="after_build"]').attrib.src.should.be.equal('scripts/hook.js');
        });
    });
});