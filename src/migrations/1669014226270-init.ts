import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1669014226270 implements MigrationInterface {
  name = 'init1669014226270';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "full_name" character varying(255) NOT NULL, "password" character varying(255), "role" "users_role_enum" NOT NULL DEFAULT 'admin', "refresh_token" character varying(255), "refresh_token_expires_at" TIMESTAMP, CONSTRAINT "UQ_5230070094e8135a3d763d90e75" UNIQUE ("refresh_token"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
