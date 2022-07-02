const request = require("supertest");
const app = require("../app");

let elementId;

describe("API Test", () => {
    test("GET /users/all", (done) => {
        request(app)
            .get("/users/all")
            .expect(200)
            .expect((res) => {
                res.body.length !== 0;
            })
            .end((err, res) => {
                if (err) return done(err);
                return done();
            })
    });

    test("POST /users/create", (done) => {
        request(app)
            .post("/users/create")
            .expect("Content-Type", /json/)
            .send({
                name: "Exemplo",
                email: "exemplo@email.com",
                password: "descubra"
            })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                elementId = res.body.savedUser._id;
                return done();
            });
    });

    test("PATCH /users/update/:id", (done) => {
        request(app)
            .patch(`/users/update/${elementId}`)
            .expect("Content-Type", /json/)
            .send({
                name: "Exemplo Atualizado",
                email: "exemploatualizado@email.com"
            })
            .expect(200)
            .expect((res) => {
                res.body.id = elementId;
                res.body.email = "exemploatualizado@email.com";
              })
            .end((err, res) => {
                if(err) return done(err);
                return done;
            })
    });

    test("DELETE /users/delete/:id", (done) => {
        request(app)
          .delete(`/users/delete/${elementId}`)
          .expect("Content-Type", /json/)
          .expect(200)
          .expect((res) => {
            res.body.length = 1;
            res.body.email = "exemploatualizado@email.com";
          })
          .end((err, res) => {
            if (err) return done(err);
            return done();
          });
      });
});