const http = require('http');
const app = require('../index');



let server;

beforeAll(() => {
    server = app.listen(4000); // Start the server on port 4000 before running tests
  });
  
  afterAll(() => {
    server.close(); // Close the server after tests
  });
  

describe('GET /api/appointments/', () => {
    it('should respond with status  200"', (done) => {
        http.get('http://localhost:4000/api/appointments/', (response) => {
            expect(response).toEqual(object)
            let data = '';

            response.on('data', (dataReturned) => {
              data += dataReturned; 
            });

            response.on('end', () => {
                expect(response.statusCode).toBe(200);
                done(); //Close server
                                
            })
        })
    });
});



// describe('POST /api/appointments/', () => {
//     it('should respond with status 200"', async () => {
//         const postData = JSON.stringify({ patientName: 'name', doctorName: "name", date: "16-05-2024" });

//         const response = await fetch('http://localhost:4000/api/appointments/create',{
//             method: 'POST',
//             body: postData,
//             headers:{
//                 'Content-Type': 'application/json'
//             }
//         })
        
//         expect(response.status).toBe(200)
//     })
// });


