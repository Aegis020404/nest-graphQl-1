import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import { UsersModule } from './users/users.module';
import {GraphQLModule} from "@nestjs/graphql";
import { ApolloDriver } from '@nestjs/apollo';

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true, envFilePath: '.env'}),
        GraphQLModule.forRoot({
            driver: ApolloDriver,
           autoSchemaFile: 'schema.gql',
           sortSchema: true,
           playground: true,

        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                type: 'postgres',
                port: config.get('TYPEORM_PORT'),
                host: config.get('TYPEORM_HOST'),
                username: config.get('TYPEORM_USERNAME'),
                password: config.get('TYPEORM_PASSWORD'),
                database: config.get('graph1'),
                entities: [__dirname + 'dist/**/*.entity{.ts,.js}'],
                synchronize: true,
                autoLoadEntities: true,
                logger: 'debug'
            })
        }),
        UsersModule
    ],
})
export class AppModule {
}
