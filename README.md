# NC News Seeding
1. For connection locally to databases with choosing to test or development environment you need to create in the main root two files: 
       .env.test
       .env.development

2. Write down into these files 

     PGDATABASE=

and assign to PGDATABASE the database's name which you can find in the file db/setup-dbs.sql accordingly to the .env file's name (considering about what kind of environment you need to mention in the .env file: test or development).