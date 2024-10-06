using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    
    public class BuggyController : BaseAPIController
    {
        [HttpGet("not-found")]

        public ActionResult GetNotFound()
        {
            return NotFound();
        }
        [HttpGet("bad-request")]

        public ActionResult GetBadRequest()
        {
            return BadRequest(new ProblemDetails() { Title="This request is bad request."});
        }
        [HttpGet("unauthorized-error")]

        public ActionResult GetUnAuthorized()
        {
            return Unauthorized();
        }
        [HttpGet("validation-error")]

        public ActionResult GetValidationError()
        {
            ModelState.AddModelError("Problem1", "Validation1");
            ModelState.AddModelError("Problem2", "Validation2");
            return ValidationProblem();
        }
        [HttpGet("server-error")]

        public ActionResult GetServerError()
        {
            throw new Exception("This is a server error");
        }
    }
}
