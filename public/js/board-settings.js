function getFieldProperty(target, id) {
    return target.getElementsByTagName('input')[id].value;
}

function setFieldValue(target, id, value) {
    target.getElementsByTagName('input')[id].value = value;
}

function onSubmit(ids, projectId, providerId, fieldName) {
    return ((event) => {
        event.preventDefault();

        ids[providerId] = getFieldProperty(event.currentTarget, fieldName);
        
        console.log('sending:');
        console.log(ids);
        
        AP.request({
            url: `/rest/api/3/project/${projectId}/properties/ids`,
            type: 'PUT',
            data: JSON.stringify(ids),
            contentType: 'application/json',
            success: (res) => {
                console.log("Succeeded:");
                console.log(res);
                // This is a temporary solution.
                // TODO: use react hooks instead.
                AP.navigator.reload();
            },
            error: (xhr, status, error) => {
                console.log("Something went wrong:");
                console.log(error);
            }
        });
    });
}

function listenForSubmit(formId, ids, projectId, provider, fieldId) {
    const form = document.forms[formId];
    if (ids[provider])
    {
        setFieldValue(form, fieldId, ids[provider]);
    }
    form.addEventListener('submit', onSubmit(ids, projectId, provider, fieldId));
}

// Get the project ID.
AP.context.getContext((response) => {
    const projectId = response.jira.project.id;
    
    // Get the provider IDs.
    AP.request(`/rest/api/3/project/${projectId}/properties/ids`)
    .then( (data) => {
        console.log("Received:");
        console.log(data);
        let ids = JSON.parse(data.body).value;

        // Setup the Steam form.
        listenForSubmit('steam-update-form', ids, projectId, 'steam', 'steam-id-field');
        
        // Setup GOG

        // If we have an id
        if (ids.gog) {
            // Display logout button
            render("gog",
                `<a>
                    <button type="button" class="aui-button aui-button-primary">Logout</button>
                </a>`
            );
        } else {
            // Display login button
            render("gog",
                `<a>
                    <button type="button" class="aui-button aui-button-primary">Login <i class="fas fa-sm fa-external-link-alt"></i></button>
                </a>`
            );
        }
    })
    .catch( (err) => {
        console.log("Something went wrong:");
        console.log(err);
    });
});