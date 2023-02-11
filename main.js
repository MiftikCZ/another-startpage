const data = {
    save: (key, value) => {
        return localStorage.setItem(key, value)
    },
    get: (key) => {
        if (localStorage.getItem(key) == "null" || !localStorage.getItem(key)) {
            return null
        }
        return localStorage.getItem(key) || null
    }
}


function add_todo_text(e) {
    e.text ||= "None"
    let ago = Date.now() - e.time
    let days = Math.floor(ago / (1000*60*60*24))
    let timetext = days + " days ago"
    if(days == 0) timetext = "Today"
    let text = `
    <div class="task" id="task-${e.id}">
    <div class="head">
        <span class="one">${timetext}</span>
        <span class="two" onclick="delete_todo('${e.id}')"><i class="fa-solid fa-xmark"></i></span>
    </div>
    <div class="content">${e.text}</div>
    </div>
    `

    document.getElementById("tasks").innerHTML+=text
}

function reload_todos() {
    document.getElementById("tasks").innerHTML = ""
    Object.entries((localStorage)).filter(e => e[0].startsWith("task-")).map(e => [
        e[0], JSON.parse(e[1])
    ]).forEach(e=>{
        let ind = e[0].split("task-").join("")
        let dt = e[1]
        add_todo_text({
            id: ind,
            ...dt    
        })
    })
}

function save_todo_db(info) {
    data.save("task-"+info.id, JSON.stringify({
        text: info.text,
        time: parseInt(Date.now())
    }))
}

function add_task() {
    let val = document.getElementById("addtask").value
    if(!val) return
    let id = Date.now()

    save_todo_db({
        id,
        text: val,
        time: id
    })

    reload_todos()

    document.getElementById("addtask").value = ""
}

function add_link(title, link) {
    document.getElementById("links").innerHTML+=`
    <div class="task" onclick="window.open('https://${link}')">
        <div class="head">${title}</div>
        <div class="content">${link}</div>
    </div>
    `
}


reload_todos(data)

add_link("Github", "github.com")
add_link("ChatGPT", "chat.openai.com/chat")
add_link("MiftikWeb", "miftik.tk")
add_link("Idea Keeper", "miftikcz.github.io/idea-keeper")


function delete_todo(id) {
    localStorage.removeItem("task-"+id)
    document.getElementById("task-" + id).remove()
}

function setTime() {
    let date = new Date()
    let hours = (date.getHours()).toString()
    let minutes = (date.getMinutes()).toString()
    if(minutes.length < 1.1) {
        minutes = `0${minutes}`
    }


    let ret = FORMAT
    .split("%MON").join(date.getUTCMonth())
    .split("%h").join(hours)
    .split("%m").join(minutes)
    .split("%s").join(date.getSeconds())
    .split("%MS").join(date.getMilliseconds())

    document.getElementById("clocks").innerHTML = ret
}

const FORMAT = "%h:%m"

setTimeout(()=>{
    setInterval(()=>{
        setTime()
    },15 * 1000)
},(60 - new Date().getMinutes()) * 1000)

setTime()
