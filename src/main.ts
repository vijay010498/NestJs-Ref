import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';
import { Logger } from '@nestjs/common';
import * as cluster from 'cluster';
import * as os from 'os';
const numCpu = os.cpus().length;

async function bootstrap() {
  if (cluster.isMaster) {
    console.log(`I am the master I will create ${numCpu} worker's`);
    for (let i = 0; i < numCpu; i++) {
      cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
      console.log(
        `worker ${worker.process.pid} dead with code ${code} and signal:${signal}`,
      );
      cluster.fork();
      console.log('Died Thread started');
    });
  } else {
    const logger = new Logger('Main', true);
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe()); // no need to write at controller level
    app.useGlobalInterceptors(new TransformInterceptor());
    const PORT = process.env.PORT;
    await app.listen(PORT, () => {
      logger.log(`worker "${process.pid}" started on port ${PORT}`);
    });
  }
}
bootstrap();
