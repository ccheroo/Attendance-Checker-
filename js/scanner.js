// ======================================================
// ATTENDANCE CHECKER
// QR SCANNER MODULE
// VERSION 1.0 CLEAN STABLE
// ======================================================



// ================================
// OPEN SCANNER
// ================================


export function openScanner(){



    const result =
    document.getElementById(
        "scanResult"
    );





    if(!result){

        console.error(
            "Scan result container missing"
        );

        return;

    }







    if(typeof Html5QrcodeScanner === "undefined"){


        result.innerHTML = `


        <p style="color:red;">

        QR Scanner library not loaded.

        </p>


        `;


        console.error(
            "Html5QrcodeScanner missing"
        );


        return;


    }









    const scanner =
    new Html5QrcodeScanner(

        "reader",

        {

            fps:10,

            qrbox:250

        },

        false

    );









    scanner.render(

        (decodedText)=>{



            console.log(
                "QR RESULT:",
                decodedText
            );





            result.innerHTML = `


            <div class="card">


            <h3>
            QR Detected
            </h3>



            <p>

            Student ID:

            <strong>
            ${decodedText}
            </strong>


            </p>



            </div>



            `;





            scanner.clear();



        },



        (errorMessage)=>{


            // scanning process errors ignored


        }



    );



}
