const jsonHeaders = {
    "Content-Type": "application/json",
    "Accept": "application/json"
}

const apiPath = "/rest/api/3"

const DEFAULT_IDS = {
    steam: ""
}
//const issuekey = "game-issue"

//TODO: make these configurable

export default function routes(app, addon) {
    // Redirect root path to /atlassian-connect.json,
    // which will be served by atlassian-connect-express.
    app.get('/', (req, res) => {
        res.redirect('/atlassian-connect.json');
    });

    // This is an example route used by "generalPages" module (see atlassian-connect.json).
    // Verify that the incoming request is authenticated with Atlassian Connect.
    app.get('/hello-world', addon.authenticate(), (req, res) => {
        // Rendering a template is easy; the render method takes two params:
        // name of template and a json object to pass the context in.
        res.render('hello-world', {
            title: 'Atlassian Connect'
            //issueId: req.query['issueId']
        });
    });

    // Add additional route handlers here...

    app.get('/board-settings', addon.authenticate(), (req, res) => {
        const httpClient = addon.httpClient(req);

        httpClient.get({
            "headers": jsonHeaders,
            "url": apiPath + `/project/${req.query['projectId']}/properties/ids`
        },
        (err, response, body) => {
            if (err) {
                res.send(`Error: ${response.statusCode}: ${err}`)
            } else {
                if (body.key && body.key === "ids") {
                    // We received valid data.
                    res.render("board-settings", {
                        id: {...body.values}
                    })
                } else {
                    // We did not receive valid data. Use empty data.
                    res.render("board-settings", {
                        ids: DEFAULT_IDS
                    })
                }
            }
        })
    });
}
