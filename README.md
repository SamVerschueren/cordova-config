# cordova-config

[![Build Status](https://travis-ci.org/SamVerschueren/cordova-config.svg?branch=master)](https://travis-ci.org/SamVerschueren/cordova-config)
[![Coverage Status](https://coveralls.io/repos/SamVerschueren/cordova-config/badge.svg?branch=master&service=github)](https://coveralls.io/github/SamVerschueren/cordova-config?branch=master)

> Parse and edit the config.xml file of a cordova project.


## Install

```
npm install --save cordova-config
```


## Usage

```js
const Config = require('cordova-config');

// Load and parse the config.xml
const config = new Config('config.xml');
config.setName('My application');
config.setDescription('This is the description of my application');
config.setAuthor('Sam Verschueren', 'sam.verschueren@gmail.com', 'https://github.com/SamVerschueren');

// Write the config file
config.writeSync();
```

## API

### Config(file)

> Loads and parses the file.

#### file

*Required*  
Type: `string`

The path to the `config.xml` file.

### #setName(name)

> Sets the `<name>name</name>` tag in the xml file.

#### name

*Required*  
Type: `string`

The name of the application.

### #setElement(tag, [text], [attribs])

> Sets a `<tag>text</tag>` tag in the xml file.

#### tag

*Required*  
Type: `string`

The name of the element.

#### text

Type: `string`

The element text.

#### attribs

Type: `object`

The element attributes

### #setDescription(description)

> Sets the `<description>description</description>` tag in the xml file.

#### description

*Required*  
Type: `string`

The description of the application.

### #setAuthor(name [, email [, website]])

> Sets the `<author email="email" href="website">name</author>` tag in the xml file.

#### name

*Required*  
Type: `string`

The name of the author.

#### email

Type: `string`

The email address of the email.

#### website

Type: `string`

The website of the author.

### #setVersion(version [, allowSemver])

> Sets the version attribute of the `widget` tag in the xml file.

#### version

*Required*  
Type: `string`

The version in the format `x.y.z`.

#### allowSemver

Type: `boolean`

Allows semver version formats. Version is checked via `semver.valid(version)`  

### #setAndroidVersionCode(version)

> Sets the android-versionCode attribute of the `widget` tag in the xml file.

#### version

*Required*  
Type: `number`

The Android version code.

### #setAndroidPackageName(packageName)

> Sets the Android package name of the config file.

#### packageName

*Required*  
Type: `string`

The android package name.

### #setIOSBundleVersion(version)

> Sets the ios-CFBundleVersion attribute of the `widget` tag in the xml file.

#### version

*Required*  
Type: `string`

The version in the format `x.y.z`.


### #setIOSBundleIdentifier(identifier)

> Sets the iOS CFBundleIdentifier of the config file.

#### identifier

*Required*  
Type: `string`

The iOS `CFBundleIdentifier`.

### #setPreference(name, value)

> Adds a `<preference name="name" value="value" />` tag to the xml file.

#### name

*Required*  
Type: `string`

The name of the preference tag.

#### value

*Required*  
Type: `string|boolean`

The value of the preference.

### #removeAccessOrigins()

> Removes all the `<access />` tags in the xml file.

### #removeAccessOrigin(origin)

> Removes the `<access />` tag with the origin equal to the parameter.

#### origin

*Required*  
Type: `string`

The origin of the access tag you want to remove.

### #setAccessOrigin(origin [, options])

> Adds an `<access />` tag to the xml file.

#### origin

*Required*  
Type: `string`

The origin of the access tag.

#### options

Type: `object`

A map with extra attributes that will be added to the access tag.

### #setID(id)

> Sets the ID of the config file.

#### id

*Required*  
Type: `string`

The id of the widget tag.

### #addHook(type, src)

> Adds the hook with type and src. see [Apache Cordova API Documentation](https://goo.gl/5QZlqu) for more info.

#### type

*Required*  
Type: `string`

Cordova hook type. ex) 'after_build', 'after_compile', 'after_clean'

#### src

*Required*  
Type: `string`

Src path of hook script

### #addRawXML(xml)

> Adds a raw xml element to the root of the config file.

#### xml

*Required*  
Type: `string`

A raw xml element. You can only pass in one element with one root.

### #write()

> Writes the `config.xml` file async.

Resolves a promise when the file is written.

### #writeSync()

> Writes the `config.xml` file synchronously.


## Related

- [cordova-config-cli](https://github.com/ragingwind/cordova-config-cli) - CLI for this module


## License

MIT © Sam Verschueren
