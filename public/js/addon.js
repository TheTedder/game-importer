/* App frontend script */

function getFieldProperty(target, id) {
    return target.getElementsByTagName("input")[id].value;
}

function onSubmit(event) {
    event.preventDefault();

    const data = {
        ids: {
           steam: getFieldProperty(event.target, "steam-id-field")
        }
    }
    
    AP.context.getContext((response) => {
        const projectId = response.jira.project.id;
        
        AP.request({
            url: `/rest/api/3/project/${projectId}/properties/ids`,
            type: 'PUT',
            data: JSON.stringify(data),
            contentType: "application/json",
            success: (res) => {
                console.log("Succeeded:");
                console.log(res);
            },
            error: (xhr, status, error) => {
                console.log("Something went wrong:");
                console.log(error);
            }
        });
    });
}

const steamForm = document.forms["steam-update-form"];
steamForm.addEventListener("submit", onSubmit);
