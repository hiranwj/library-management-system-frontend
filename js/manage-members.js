const API_END_POINT = 'http://34.100.243.249:8080/lms/api';

const pageSize = 5;
let page = 1;

getMembers();

function getMembers(query=`${$(`#txt-search`).val()}`) {
    /* (1) Initialize a XMLHttpRequest object */
    const http = new XMLHttpRequest();


    /* (2) set an event listener to detect state change */
    http.addEventListener('readystatechange', ()=> {
        if(http.readyState === http.DONE){
            if(http.status === 200){
                // console.log(http.responseText);

                const totalMembers = +http.getResponseHeader('X-Total-Count'); // + for convert to integer
                initPagination(totalMembers);

                const members = JSON.parse(http.responseText); // return members array
                $('#loader').hide();
                if (members.length === 0){
                    $('#tbl-members').addClass('empty');
                }else {
                    $('#tbl-members').removeClass('empty');
                }

                members.forEach(member => {
                    const rowHtml = `
                    <tr tabindex="0">
                        <td>${member.id}</td>
                        <td>${member.name}</td>
                        <td>${member.address}</td>
                        <td>${member.contact}</td>
                    </tr>
                `;
                $('#tbl-members tbody').append(rowHtml);
                });
                
            }else{
                $('#toast').show();
                // console.error('Something went wrong');
            }
        }
    });

    /* (3) Open the request */
    http.open('GET', `${API_END_POINT}/members?size=${pageSize}&page=${page}&q=${query}`, true);

    /* (4) Set additioanl information for the request (can get from documentation)*/


    /* (5) Send the request */
    http.send();
}


function initPagination(totalMembers){

    const totalPages = Math.ceil(totalMembers/pageSize);

    if (totalPages === 1){
        $("#pagination").addClass('d-none');
    }else{
        $("#pagination").removeClass('d-none');
    }

    let html = '';
    for(let i=1; i <= totalPages; i++){
        html += `<li class="page-item ${i===page?'active':''}"><a class="page-link" href="#">${i}</a></li>`
    }
    html = `
        <li class="page-item ${page === 1? 'disabled': ''}"><a class="page-link" href="#">Previous</a></li>
        ${html}
        <li class="page-item ${page === totalPages? 'disabled': ''}"><a class="page-link" href="#">Next</a></li>
        `;

    $('#pagination > .pagination').html(html);

    $('#pagination > .pagination').click((eventData)=> {
        // console.log(eventData.target);
        const elm = eventData.target;
        if (elm && elm.tagName === 'A') {
            // console.log($(elm).text());
            const activePage = ($(elm).text());
            if (activePage === 'Next') {
                page++;
                getMembers();
            }else if (activePage === 'Prevoius') {
                page--;
                getMembers();
            }else{
                if (page !== activePage){
                    page = +activePage;
                    getMembers();
                }
                
            }
        }
    });
}

$('#txt-search').on('input', ()=>{
    // console.log("working");
    page = 1;
    getMembers();
});

$(`#tbl-members tbody`).keyup((eventData)=> {
    if (eventData.which === 38){
        // console.log('Up arrow key pressed');
        const elm = document.activeElement.previousElementSibling;
        if (elm instanceof HTMLTableRowElement) {
            elm.focus();
        }
    }else if(eventData.which === 40){
        // console.log('Down arrow key pressed');
        const elm = document.activeElement.nextElementSibling;
        if (elm instanceof HTMLTableRowElement) {
            elm.focus();
        }
    }
});

$(document).keyup((eventData)=>{
    // console.log(eventData);
    if(eventData.ctrlKey && eventData.key === '/'){
        $('#txt-search').focus();
    }
})

$('#btn-new-member').click(()=> {
    const frmMemberDetail = new bootstrap.Modal(document.getElementById('frm-member-detail'));
    $('#frm-member-detail').addClass('new')
        .on('shown.bs.modal', ()=>{
        $('txt-name').focus();
    });
    frmMemberDetail.show();
});

$("#frm-member-detail").submit(()=> $('#btn-save').click());

$('#btn-save').click(() =>{
    
    const name = $('#txt-name').val();
    const address = $('#txt-address').val();
    const contact = $('#txt-contact').val();
    let validated = true;


    $('#txt-name, #txt-address, #txt-contact').removeClass('is-invalid');

    if(!/^\d{3}-\d{7}$/.test(contact)) {
        $('#txt-contact').addClass('is-invalid');
        let validated = true;
    }

    if (!/^[A-Za-z ]+$/.test(name)) {
        $('#txt-name').addClass('is-invalid');
        let validated = true;
    }

    if(!/^[A-Za-z0-9#|,./\-;:]+$/.test(address)) {
        $('#txt-address').addClass('is-invalid');
        let validated = true;
    }
    
    if(!validated) return;

    saveMember();

});


function saveMember(){
    return new Promise((resolve, reject) => {
        
        // setTimeout(()=> resolve(), 5000);
        setTimeout(()=> reject(), 2000);

    });
}

doSomething();

async function doSomething() {
    try{
        await saveMember();
        console.log("Promise eka una widihatama una...");
    }catch(e){
        console.log("Promise eka una...");
    }
}


// async function saveMember(){
//         // setTimeout(()=> resolve(), 5000);
//         setTimeout(()=> reject(), 2000);
// }

// const promise = saveMember();
// console.log(promise);

// promise.then(()=> {
//     console.log(promise);
//     console.log("Kiwwa wagema kala... 1");
// }).catch(()=> {
//     console.log("Promise eka kalea...! 1");
// });

// promise.then(()=> {
//     console.log("Kiwwa wagema kala... 2");
// }).catch(()=> {
//     console.log("Promise eka kalea...! 2");
// });

