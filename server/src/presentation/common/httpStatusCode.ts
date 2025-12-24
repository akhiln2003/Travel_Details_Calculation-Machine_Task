enum HttpStatusCode {
    // Informational responses (100-199)
    Continue = 100, // The server has received the request headers, and the client should proceed to send the request body
    SwitchingProtocols = 101, // The server is switching protocols as per the Upgrade header
    Processing = 102, // WebDAV: The server has received the request but is processing it

    // Successful responses (200-299)
    OK = 200, // The request has succeeded
    Created = 201, // The request has been fulfilled and resulted in a new resource being created
    Accepted = 202, // The request has been accepted for processing, but the processing has not been completed
    NonAuthoritativeInformation = 203, // The server successfully processed the request, but the response is not from the original server
    NoContent = 204, // The server successfully processed the request, but there is no content to send in the response
    ResetContent = 205, // The server successfully processed the request, but the user agent should reset the document view
    PartialContent = 206, // The server is delivering part of the resource due to a range header sent by the client

    // Redirection responses (300-399)
    MultipleChoices = 300, // The request has more than one possible response
    MovedPermanently = 301, // The requested resource has been permanently moved to a new URI
    Found = 302, // The requested resource resides temporarily under a different URI
    SeeOther = 303, // The response to the request can be found under a different URI using the GET method
    NotModified = 304, // The resource has not been modified since the last request
    UseProxy = 305, // The requested resource must be accessed through a proxy
    TemporaryRedirect = 307, // The resource resides temporarily under a different URI, and the client should use the same HTTP method
    PermanentRedirect = 308, // The resource has been permanently moved to a new URI, and the client should use the same HTTP method

    // Client error responses (400-499)
    BadRequest = 400, // The server could not understand the request due to invalid syntax
    Unauthorized = 401, // The client must authenticate itself to get the requested response
    Forbidden = 403, // The client does not have access rights to the content
    NotFound = 404, // The server can’t find the requested resource
    MethodNotAllowed = 405, // The request method is not allowed for the requested resource
    NotAcceptable = 406, // The server can’t produce a response matching the list of acceptable values
    ProxyAuthenticationRequired = 407, // The client must first authenticate itself with the proxy
    RequestTimeout = 408, // The server timed out waiting for the request
    Conflict = 409, // The request could not be completed due to a conflict with the current state of the resource
    Gone = 410, // The resource is no longer available and will not be available again
    LengthRequired = 411, // The request did not specify the length of its content
    PreconditionFailed = 412, // The server does not meet one of the preconditions that the requester specified
    PayloadTooLarge = 413, // The request is larger than the server is willing or able to process
    URITooLong = 414, // The URI requested by the client is too long for the server to process
    UnsupportedMediaType = 415, // The media type of the request data is not supported by the server
    RangeNotSatisfiable = 416, // The range specified by the Range header is not satisfiable
    ExpectationFailed = 417, // The server cannot meet the requirements of the Expect header
    IAmATeapot = 418, // The server is a teapot (a joke HTTP status code from an April Fool’s Day joke)
    MisdirectedRequest = 421, // The request was directed at a server that is not able to produce a response
    UnprocessableEntity = 422, // The server understands the request but it cannot process it due to semantic errors
    Locked = 423, // The resource that is being accessed is locked
    FailedDependency = 424, // The request failed due to failure of a previous request
    TooEarly = 425, // The server is unwilling to risk processing a request that might be replayed
    UpgradeRequired = 426, // The client should upgrade to a different protocol
    PreconditionRequired = 428, // The server requires the request to be conditional
    TooManyRequests = 429, // The client has sent too many requests in a given amount of time
    RequestHeaderFieldsTooLarge = 431, // The server is unwilling to process the request because its header fields are too large
    UnavailableForLegalReasons = 451, // The resource is unavailable for legal reasons

    // Server error responses (500-599)
    InternalServerError = 500, // The server has encountered a situation it doesn't know how to handle
    NotImplemented = 501, // The server does not support the functionality required to fulfill the request
    BadGateway = 502, // The server, while acting as a gateway or proxy, received an invalid response from the upstream server
    ServiceUnavailable = 503, // The server is not ready to handle the request, usually because it is overloaded or down for maintenance
    GatewayTimeout = 504, // The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server
    HTTPVersionNotSupported = 505, // The HTTP version used in the request is not supported by the server
    VariantAlsoNegotiates = 506, // The server has an internal configuration error: the chosen variant resource is itself a negotiable resource
    InsufficientStorage = 507, // The server is unable to store the representation needed to complete the request
    LoopDetected = 508, // The server detected an infinite loop while processing the request
    NotExtended = 510, // The policy for accessing the resource has not been met
    NetworkAuthenticationRequired = 511, // The client needs to authenticate to gain network access
}

export default HttpStatusCode;
