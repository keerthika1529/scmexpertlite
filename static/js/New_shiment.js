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

function openDrawer() {
    document.getElementById("myDrawer").style.width = "250px";
}

function closeDrawer() {
    document.getElementById("myDrawer").style.width = "0";
}


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
            console.log(response)
        })
    })
})

if (localStorage.getItem("token") === null) {
window.location.href = "/";
}