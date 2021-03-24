# AsyncAPI schema

To run the java-spring-template generator, you can use the following command:
```
npm install # in tools/interface-generator if you haven't already
npm install -g @asyncapi/generator # If you haven't already
ag -o ../../generated-sources/interfaces/java example.yml ../../tools/interface-generator/ --force-write # Force write regenerates the code
```
