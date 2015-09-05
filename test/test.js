'use strict';

/**
 * Test suite for cordova-config
 *
 * @author Sam Verschueren      <sam.verschueren@gmail.com>
 * @since  28 Aug. 2015
 */

// module dependencies
var chai = require('chai'),
    sinon = require('sinon'),
    fs = require('fs-extra'),
    path = require('path'),
    os = require('os'),
    tempfile = require('tempfile');

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
            config._root._children.should.have.length(7);
        });

        it('Should remove the Byte Order Mark', function() {
            var config = new Config(__dirname + '/fixtures/config.bom.xml');

            config._root.tag.should.be.equal('widget');
            config._root.attrib.id.should.be.equal('cordova-config');
            config._root.attrib.version.should.be.equal('0.0.1');
            config._root._children.should.have.length(5);
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

    describe('#setIOSBundleVersion', function() {
        it('Should throw an error if the version equals ab', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');

            config.setIOSBundleVersion.bind(config, 'ab').should.throw(Error);
        });

        it('Should throw an error if the version equals 1', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');

            config.setIOSBundleVersion.bind(config, '1').should.throw(Error);
        });

        it('Should throw an error if the version equals 1.1', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');

            config.setIOSBundleVersion.bind(config, '1.1').should.throw(Error);
        });

        it('Should not throw an error if the version equals 1.1.1', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');

            config.setIOSBundleVersion.bind(config, '1.1.1').should.not.throw(Error);
        });

        it('Should not throw an error if the version equals 1.1.1.1', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');

            config.setIOSBundleVersion.bind(config, '1.1.1.1').should.throw(Error);
        });

        it('Should not throw an error if the version equals a.b.c', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');

            config.setIOSBundleVersion.bind(config, 'a.b.c').should.throw(Error);
        });

        it('Should not throw an error if the version equals 1..1', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');

            config.setIOSBundleVersion.bind(config, '1..1').should.throw(Error);
        });

        it('Should not throw an error if the version equals 1.1.', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');

            config.setIOSBundleVersion.bind(config, '1.1.').should.throw(Error);
        });

        it('Should overwrite version of the widget tag', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');
            config.setIOSBundleVersion('1.1.1');

            config._root.attrib['ios-CFBundleVersion'].should.be.equal('1.1.1');
        });

        it('Should set the version of the widget tag', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.empty.xml');
            config.setIOSBundleVersion('1.1.1');

            config._root.attrib['ios-CFBundleVersion'].should.be.equal('1.1.1');
        });
    });

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

    describe('#removeAccessOrigins', function() {
        it('Should remove all the access origins tags', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');
            config.removeAccessOrigins();

            config._root.findall('./access').should.have.length(0);
        });

        it('Should do nothing if no access tags are present', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.empty.xml');
            config.removeAccessOrigins();

            config._root.findall('./access').should.have.length(0);
        });
    });

    describe('#removeAccessOrigin', function() {
        it('Should remove the \'*\' access origin', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');
            config.removeAccessOrigin('*');

            config._root.findall('./access').should.have.length(1);
        });

        it('Should keep the \'http://www.google.com\' access origin', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');
            config.removeAccessOrigin('*');

            var tag = config._root.find('./access');

            tag.attrib.origin.should.be.equal('http://www.google.com');
        });

        it('Should do nothing if the access origin does not exist', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.empty.xml');
            config.removeAccessOrigin('*');

            config._root.findall('./access').should.have.length(0);
        });
    });

    describe('#setAccessOrigin', function() {
        it('Should add an extra access origin tag', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');
            config.setAccessOrigin('http://my.api.com');

            config._root.findall('./access').should.have.length(3);
        });

        it('Should add an extra access origin tag with an option', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');
            config.setAccessOrigin('https://*', {'launch-external': 'yes'});

            var tag = config._root.find('./access/[@origin="https://*"]');

            tag.attrib.origin.should.be.equal('https://*');
            tag.attrib['launch-external'].should.be.equal('yes');
        });

        it('Should add an extra access origin tag with more options', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');
            config.setAccessOrigin('https://*', {a: 'b', c: 'd', e: 'f'});

            var tag = config._root.find('./access/[@origin="https://*"]');

            tag.attrib.origin.should.be.equal('https://*');
            tag.attrib.a.should.be.equal('b');
            tag.attrib.c.should.be.equal('d');
            tag.attrib.e.should.be.equal('f');
        });

        it('Should replace an existing access origin', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');
            config.setAccessOrigin('*', {'launch-external': 'yes'});

            // Count the number of access origin tags
            config._root.findall('./access').should.have.length(2);

            // Check the tag
            var tag = config._root.find('./access/[@origin="*"]');
            tag.attrib.origin.should.be.equal('*');
            tag.attrib['launch-external'].should.be.equal('yes');
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

    describe('#addRawXML', function() {
        it('Should add raw xml to the config file', function() {
            // Load the config
            var config = new Config(__dirname + '/fixtures/config.xml');
            config.addRawXML(
                '<platform name="android">' +
                '   <icon src="res/android/ldpi.png" density="ldpi" />' +
                '   <icon src="res/android/mdpi.png" density="mdpi" />' +
                '   <icon src="res/android/hdpi.png" density="hdpi" />' +
                '   <icon src="res/android/xhdpi.png" density="xhdpi" />' +
                '</platform>');

            var platform = config._doc.find('./platform/[@name="android"]');
            platform._children.should.have.length(4);
        });
    });

    describe('#write', function() {
        beforeEach(function() {
            this.tmp = path.join(tempfile(), 'config.xml');

            fs.copySync(path.join(__dirname, '/fixtures/config.empty.xml'), this.tmp);
        });

        it('Should write the file', function(done) {
            var result = [
                "<?xml version='1.0' encoding='utf-8'?>",
                '<widget id="cordova-config" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">',
                '    <name>Hello World</name>',
                '    <description>This is my description</description>',
                '</widget>'
            ];

            // Load config and set name and description
            var config = new Config(this.tmp);
            config.setName('Hello World');
            config.setDescription('This is my description');

            // Write the config file
            config.write(function(err) {
                if(err) {
                    return done(err);
                }

                // Read the config file and check the contents
                var content = fs.readFileSync(this.tmp, 'utf8');

                content.should.be.equal(result.join(os.EOL) + os.EOL);

                done();
            }.bind(this));
        });

        it('Should write the file and return a promise', function(done) {
            var tmp = this.tmp;

            var result = [
                "<?xml version='1.0' encoding='utf-8'?>",
                '<widget id="cordova-config" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">',
                '    <name>Hello World</name>',
                '    <description>This is my description</description>',
                '</widget>'
            ];

            // Load config and set name and description
            var config = new Config(tmp);
            config.setName('Hello World');
            config.setDescription('This is my description');

            // Write the config file
            config.write()
                .then(function() {
                    var content = fs.readFileSync(tmp, 'utf8');

                    content.should.be.equal(result.join(os.EOL) + os.EOL);

                    done();
                })
                .catch(function(err) {
                    done(err);
                });
        });

        it('Should reject the promise if something went wrong', sinon.test(function(done) {
            // Make sure it throws an error
            this.stub(fs, 'writeFileSync').throws();

            // Load config and set name and description
            var config = new Config(this.tmp);

            // Write the config file
            config.write()
                .then(function() {
                    done(new Error('This should not be called'));
                })
                .catch(function(err) {
                    console.log(err);
                    done();
                });
        }));
    });

    describe('#writeSync', function() {
        beforeEach(function() {
            this.tmp = path.join(tempfile(), 'config.xml');

            fs.copySync(path.join(__dirname, '/fixtures/config.empty.xml'), this.tmp);
        });

        it('Should write the file synchronous', function() {
            var result = [
                "<?xml version='1.0' encoding='utf-8'?>",
                '<widget id="cordova-config" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">',
                '    <name>Hello World</name>',
                '    <description>This is my description</description>',
                '</widget>'
            ];

            // Load config and set name and description
            var config = new Config(this.tmp);
            config.setName('Hello World');
            config.setDescription('This is my description');

            // Write the config file
            config.writeSync();

            // Read the config file and check the contents
            var content = fs.readFileSync(this.tmp, 'utf8');

            content.should.be.equal(result.join(os.EOL) + os.EOL);
        });
    });
});