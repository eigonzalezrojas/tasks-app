$(function () {
    // console.log('Jquery its working');
    
    /* Carga de datos en la tabla */
    $('#task-result').hide();
    fetchTasks();
    
    /*Capturamos el elemento con id=search */
    /*keyup = método de tipeo (cuando el usuario presiona una tecla) */
    $('#search').keyup(function(e){
        if ($('#search').val()) {
            /*seach.val = guarda la tecla presionada */
            let search = $('#search').val();
            $.ajax({
                url: 'task-search.php',
                type: 'POST',
                data:{search},
                success: function(response){
                    let tasks = JSON.parse(response);
                    let template = '';
                    tasks.forEach(task => {
                        //console.log(task);
                        template += `<li>
                            ${task.name}
                        </li>`
                    });

                    $('#container').html(template);
                    $('#task-result').show();
                }
            })
        }
    });

    /* Interacción con el formulario */
    $('#task-form').submit(function (e) {
        const postData={
            name: $('#name').val(),
            description: $('#description').val()
        };
        
        $.post('task-add.php', postData, function (response) {
            /* Recargamos la tabla */
            fetchTasks();

            /* Resetear valores del formulario */
            $('#task-form').trigger('reset');
        });
        e.preventDefault();
        
    })

    /* Mostrar datos en la tabla */
    function fetchTasks() {
        /* Insertar los datos en la tabla */
        $.ajax({
            url: 'task-list.php',
            type: 'GET',
            success: function (response) {
                /* Se convierte la respuesta (arreglo) en JSON */
                let tasks = JSON.parse(response);
                let template = '';
                tasks.forEach(task=>{
                    template += `
                        <tr taskId="${task.id}">
                            <td>${task.id}</td>
                            <td>${task.name}</td>
                            <td>${task.description}</td>
                            <td><button class="btn btn-danger task-delete">Delete</button></td>
                        </tr>
                    `
                });
                $('#tasks').html(template);
            }
        });
    }

    /* Botón eliminar de la tabla */
    $(document).on('click', '.task-delete', function () {
        /* this = elemnto html, posicion 0 = button */
        /* parentElement propiedad js = devuelve el elemento principal */
        let element = $(this)[0].parentElement.parentElement;
        let id = $(element).attr('taskId');
        //console.log(id);
        $.post('task-delete.php', {id}, function (response) {            
            fetchTasks();
        });
    })
})