using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace LibraryEventData.Controllers
{
    public class AttendanceController : ApiController
    {
        // GET: api/AttendanceData
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/AttendanceData/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/AttendanceData
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/AttendanceData/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/AttendanceData/5
        public void Delete(int id)
        {
        }
    }
}
