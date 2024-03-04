if (localStorage.getItem("token") === null) {
    window.location.href = "/";
}

function logout() {
    localStorage.removeItem("token");
    sessionStorage.clear()
    window.location.href= "/";
    }
    $(document).ready(function () {
        $("#submit").on("click", function (event) {
            event.preventDefault();
            const selectedDeviceId = $("#device_id").val();
     // Make a POST request to '/devicedatafirst'
            fetch("/device_data", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Device_ID: selectedDeviceId
                }),
            })
                .then(response => {

                    return response.json();
                })
                 // Construct HTML table rows based on the device data
                .then(response => {
                    console.log(response);
     
                    if (response.status_code === 400) {
                        throw new Error(` ${response.detail}`);
                    }
     
                    if (response.data && Array.isArray(response.data)) {
                        let ship_data = "";
     
                        for (let shipment_no = 0; shipment_no < response.data.length; shipment_no++) {
                            const shipment = response.data[shipment_no];
     
                            ship_data += "<tr><td>" +
                                shipment.Device_ID + "</td><td>" +
                                shipment.Battery_Level + "</td><td>" +
                                shipment.First_Sensor_temperature + "</td><td>" +
                                shipment.Route_From + "</td><td>" +
                                shipment.Route_To + "</td></tr>";
                        }
                        $("#device_data").html(ship_data);
                    } else {
                        alert("only admin can access device data");
                        // $("#error").text("Invalid data format");
                    }
                })
                .catch(error => {
                    console.log("Error:", error.message);
                    $("#error").text(error.message);
                    $("#error").css("visibility", "visible");
                    setTimeout(function () {
                        $("#error").text("");
                    }, 2000);
                });
        });
    });
