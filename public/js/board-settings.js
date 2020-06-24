function getFieldProperty(target, id) {
    return target.getElementsByTagName('input')[id].value;
}

function setFieldProperty(target, id, value) {
    target.getElementsByTagName('input')[id].value = value;
}

function onSubmit(ids, projectId, fieldId, fieldName) {
    return ((event) => {
        event.preventDefault();

        ids[fieldId] = getFieldProperty(event.currentTarget, fieldName);
        
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

// Get the project ID.
AP.context.getContext((response) => {
    const projectId = response.jira.project.id;
    
    // Get the provider IDs.
    AP.request(`/rest/api/3/project/${projectId}/properties/ids`)
    .then( (data) => {
        console.log("Received:");
        console.log(data);
        let ids = JSON.parse(data.body).value;

        const steamForm = document.forms['steam-update-form'];
        setFieldProperty(steamForm, 'steam-id-field', ids.steam);
        steamForm.addEventListener('submit', onSubmit(ids, projectId, 'steam', 'steam-id-field'), {
            once: true
        });
    })
    .catch( (err) => {
        console.log("Something went wrong:");
        console.log(err);
    });
});