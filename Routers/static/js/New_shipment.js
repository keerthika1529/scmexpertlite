$(document).ready(function () {
    document.getElementById("enter").addEventListener("click", function (event) {
        event.preventDefault();
        const form = new FormData();
        form.append('shipment_number', $("#shipment_number").val());
        form.append('route_details', $("#route_details").val());
        form.append('device', $("#device").val());
        form.append('po_number', $("#po_number").val());
        form.append('ndc_number', $("#ndc_number").val());
        form.append('serial_number', $("#serial_number").val());
        form.append('container_number', $("#container_number").val());
        form.append('goods_type', $("#goods_type").val());
        form.append('expected_delivery_date', $("#expected_delivery_date").val());
        form.append('delivery_number', $("#delivery_number").val());
        form.append('batch_id', $("#batch_id").val());
        form.append('shipment_description', $("#shipment_description").val());
        console.log(form.get('shipment_description'))
        const token = localStorage.getItem("token");
        fetch("/New_shipment", {
            method: "POST", 
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: form,
        }).then(response => {
            if (response.ok) {
                return response.json(); // Parse the JSON response
            } else {
                throw new Error('Failed to create shipment');
            }
        }).then(data => {
            // Display the success message
            alert(data.msg);
            // Clear form fields after successful submission
            clearForm();
        }).catch(error => {
            // Display the error message
            console.error('Error:', error);
            alert('Failed to create shipment');
        });
    })
})

function clearForm() {
    document.getElementById("shipment_number").value = "";
    document.getElementById("route_details").selectedIndex = 0;
    document.getElementById("device").selectedIndex = 0;
    document.getElementById("po_number").value = "";
    document.getElementById("ndc_number").value = "";
    document.getElementById("serial_number").value = "";
    document.getElementById("container_number").value = "";
    document.getElementById("goods_type").selectedIndex = 0;
    document.getElementById("expected_delivery_date").value = "";
    document.getElementById("delivery_number").value = "";
    document.getElementById("batch_id").value = "";
    document.getElementById("shipment_description").value = "";
}

if (localStorage.getItem("token") === null) {
    window.location.href = "/";
}
function logout() {
    localStorage.removeItem("token");
    sessionStorage.clear()
    window.location.href= "/";
    }

   // Get the current date in the format "yyyy-mm-dd"
    let currentDate = new Date().toISOString().split('T')[0];

    // Set the max attribute of the input field to the current date
    document.getElementById('expected_delivery_date').max = currentDate;