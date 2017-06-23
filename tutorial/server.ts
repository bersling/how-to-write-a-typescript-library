import * as connect from 'connect';
import * as serveStatic from 'serve-static';
import {ServeStaticOptions} from 'serve-static';

const options: ServeStaticOptions = {
  extensions: ['html']
};

connect().use(serveStatic(__dirname + '/dist', options)).listen(8081, function(){
  console.log('Server running on 8081...');
});
