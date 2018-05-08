# scarface 
> Scaffolding with steroids

Scarface is a node module which purpose is to make developers life easier by using templates to generate full projects

The idea of scarface is to be totally language-agnostic, so you can create your own template, by using EJS templates sintax


My motivation for creating that initially was to be productive in my own projects and then I decided to extend to the community


I have my full time job, so please feel free to help!!  



By default, it comes with **aspnetcore** template which will generate a project for an API using:
- AspNetCore 2.0
- EntityFramework 2.0 with Postgres (can be easily changed to SQL Server) 
- Swagger interface

## Installation

First, install generator-scarface using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g scarface
```

Or you can clone the full project from Github
```bash
git clone https://github.com/bruno-bert/scarface.git
```
And then, in directory of cloned project, type:
```bash
npm install
```

## Usage


Create a directory to your application:

```bash
mkDir appTest
cd appTest
```

Then, inside the directory, create a schema.json file containing all configuration of your application.
Please refer to the section **How to Configure Json file**

Then, in your terminal, type:

```bash
scarface -t [templateName]
```
```bash
scarface -t [templateName] -l [toConsole|withDate|toFile|none]  -o [outputDirectory]
  t:  Name of template to be used (REQUIRED)
  l:  Log Strategy
  o:  Output directory to generate project  
```

If you cloned the full project, you can use it by typing:
```bash
node index.js -t [templateName]
```

### How to use the aspnetcore template

By default, scarface comes with template **aspnetcore**, so as pre-requisite for this project to work
you need to have the ASPNETCORE 2.0 installed.

Then you can type:
```bash
scarface -t aspnetcore
```

At the end of proccess you will have full project created in your current folder.
This specific template creates 2 folders: app and test

Type: 

 ```bash
cd app
```

Then:

```bash
dotnet restore && dotnet run
```

Your API should be running and server listening to port 5000
In your browser, access the url http://localhost:5000/swagger

**Attention:**
This tool do not create the database for you. So, if you do not have the database created, you can do that easily
by using the Entity Framework cli tool

```bash
dotnet ef migrations add %RANDOM%
dotnet ef database update
```

## How to Configure Json file

*Full Documentation to be created*

Example:

The example below shows how to create a Json file that will generate a project based in your template

The tags in json will be used in the template selected

```json
{
  "$schema": "http://json-schema.org/draft-06/schema",

  "info": {
    "title": "My API",
    "description": "API used to connect to Sysmine database layer",
    "author": "Bruno Bertoni de Paula",
    
    "contact": {
      "email": "bruno.bert.jj@gmail.com"   
    }

  },

 
      
  "appconfig": {
    "name": "MyApi",

    "dbConnection": {
      "client": "postgres",
      "host": "localhost",
      "database": "testdb",
      "port": "5432",
      "pooling": "true",
      "userId" : "postgres",
      "password" : "icwsig@78"
    },

 
   
    "template": "aspnetcore"
    

  },

  
  "appmodel": {
    "type": "object",
    "properties": {

      "clientes": {
        "type": "array",
        "items": { "$ref": "#/definitions/cliente" }
       }

    },

    "definitions": {

        "Cliente": {
            "type": "object",
            "required": ["id","doc_cliente","nome_cliente"],
            "properties": {
              
           
            "doc_cliente": {           
                "type": "string"
            },
            "nome_cliente": {          
                "type": "string"
            },
            "descricao_cliente": {           
                "type": "string"
            },
            "flag_status": {           
                "type": "string"
            }
          
            },
"additionalProperties": { "tableName": "cliente" }
          },

      "Empresa": {

        "type": "object",
        "properties": {
         
        "cliente_id": {
            "type": "int"
        },
 

      
       
        "nome_empresa": {           
            "type": "string"
        },
        "descricao_empresa": {          
            "type": "string"
        },
        "descricao_empresa_do": {           
            "type": "string"
        },
        "flag_status": {           
            "type": "string"
        }
       



        },
"additionalProperties": { "tableName": "empresa" }

      }

     
    }
  }
}

```


## How to create new dialects

By default, the project brings only csharp dialect 

*Full Documentation to be created*


## How to create your own templates


First of all, you need to create a template project by using EJS syntax (docs: http://ejs.co/#docs)

Example of aspnetcore template for model class

```bash
using System;
using System.Text;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace <%= data.appconfig.name %>.Models {

    [Table("<%= model.additionalProperties.tableName %>")]
    public class <%= model.name %> : GenericEntity {
        <% model.properties.forEach(function(property) { %>
        <% if(property.annotations) property.annotations.forEach(function(annotation) { %>
        <%= annotation %><% }); -%> 
        [Column("<%= property.name %>")]
        public <%- property.type %> <%= property.name %> { get; set; }  <% }); -%>


       public override string ToString()
        {
            var sb = new StringBuilder();

            sb.Append("class <%= model.name %> {\n");
            <% model.properties.forEach(function(property) { %>
            sb.Append("  <%= property.name %>: ").Append(<%= property.name %>).Append("\n");    <% }); -%>

            sb.Append("}\n");

            return sb.ToString();
        }



        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != GetType()) return false;
            return Equals((<%= model.name %>)obj);
        }



         public bool Equals(<%= model.name %> other)
        {

            if (ReferenceEquals(null, other)) return false;
            if (ReferenceEquals(this, other)) return true;

            return 
           <% let counter = 1 ; %>
           <% model.properties.forEach(function(property) { %>
           ( this.<%= property.name %> == other.<%= property.name %> || 
              this.<%= property.name %> != null &&  this.<%= property.name %>.Equals(other.<%= property.name %>))  <% if (counter != model.properties.length) {%> && <% } %> <% counter+=1; %>  <% }); -%> ;
        }



         public override int GetHashCode()
        {
            unchecked 
            {
                int hash = 41;
                <% model.properties.forEach(function(property) { %>
                if (this.<%= property.name %> != null)
                hash = hash * 59 + this.<%= property.name %>.GetHashCode();  <% }); -%>                    
                return hash;
            }
        }





    }
}
```

*Full Documentation to be created*



## License

MIT © [Bruno de Paula]()


[npm-image]: https://badge.fury.io/js/generator-scarface.svg
[npm-url]: https://npmjs.org/package/generator-scarface
[travis-image]: https://travis-ci.org/bruno-bert/generator-scarface.svg?branch=master
[travis-url]: https://travis-ci.org/bruno-bert/generator-scarface
[daviddm-image]: https://david-dm.org/bruno-bert/generator-scarface.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/bruno-bert/generator-scarface
