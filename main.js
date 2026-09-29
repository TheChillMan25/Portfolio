import $ from "jquery";
import Chart from "chart.js/auto";

var langData;

$(async function(){
    await initilazeLanguageAsync();
    initilizeChart();

    const lang = localStorage.getItem("lang") ?? "hun";
    switch (lang){
        case "hun":
            alert("Az oldal jelenleg telefonos nézetben használhatatlan.")
            break;
        case "eng":
            alert("The site is currently unusable in mobile view.")
    }
    $("#lang").attr("data-active", lang)

    $("#lang").on("click", function() {
        let active = $(this).attr("data-active") === "hun" ? "eng" : "hun";
        $(this).attr("data-active", active);
        localStorage.setItem("lang", active);
        loadText(active);
    });

    $(".card").on("click", function(){
        const element = $(this);
        showProject(element);
    });

    $(".gw-button").on("click", function(){
        switch (this.id){
            case "gw":
                $("#pdf-iframe").attr("src", "assets/szakdolgozat.pdf");
                break;
            case "gwp":
                $("#pdf-iframe").attr("src", "assets/szakdolgozat_bemutato.pdf");
                break;
            default:
                $("#pdf-iframe").attr("src", "assets/szakdolgozat.pdf");
                break;
        }

        console.log(this);

        $("#pdf-container").addClass("show");
    });

    $("#pdf-container").on("click", function(e){
        if(e.target === this) $(this).removeClass("show");
    })

    $("#details-img").on("click", function(){
        $(this).toggleClass("zoom");
    });

    $("#details-container").on("click", function(e){
        if(e.target === this){
            $("#details-img").removeClass("zoom");
            $(this).removeClass("show");
            $("body").removeClass("no-scroll");
        }
    });

    $(document).on("keydown", function(e){
        if(e.key === "Escape" && $("#details-container").hasClass("show")){
            $("#details-img").removeClass("zoom");
            $("#details-container").removeClass("show");
            $("body").removeClass("no-scroll");
        }
    });
});

async function initilazeLanguageAsync(){
    const response = await fetch("data/lang.json");
    const data = await response.json();
    if(data !== null) langData = data;
    
    let lang = localStorage.getItem("lang");
    if(!(lang === "hun" || lang === "eng")){
        lang = "hun";
        localStorage.setItem("lang", lang);
    }

    loadText(lang);
} 

function loadText(lang){
    if(typeof lang !== "string" || !["hun", "eng"].includes(lang)) return;
    const nav = langData[lang]["nav"];
    $("#title").text(nav["title"]);
    
    $("#lang").text(lang.toLocaleUpperCase());

    $("#nav-link-container span").each(function(){
        $(this).text(nav[this.id]);
    });

    $("#name").text(langData[lang]["name"]);

    const aboutSection = langData[lang]["about-section"]
    $("#about-title").text(aboutSection["about-title"]);
    $("#about-text").text(aboutSection["about-text"]);

    $("#education span").each(function(){
        const element = $(this);
        if(!element.hasClass("year")){
            element.text(aboutSection[this.id]);
        }
    });

    $("#experience span, #experience strong").each(function(){
        const element = $(this);
        element.text(aboutSection[this.id]);
    });

    $("#traits-header").text(aboutSection["traits-header"]);

    const projectsSection = langData[lang]["projects-section"];
    $("#projects-title").text(projectsSection["projects-title"]);

    $("#gw").text(projectsSection["gw"]);
    $("#gwp").text(projectsSection["gwp"]);

    $("#contact-title").text(langData[lang]["contact"]["contact-title"])

    loadProjects(lang);
}

function loadProjects(lang){
    const projectsSection = langData[lang]["projects-section"]
    const main = projectsSection["main-projects"] ?? [];
    const sec = projectsSection["secondary-projects"] ?? [];
    
    const prevLang = lang === "hun" ? "eng" : "hun";
    const prevProSec = langData[prevLang]["projects-section"];
    const prevMain = prevProSec["main-projects"];

    const mPHtml = $("#main-projects");
    if(mPHtml.children().length === 0){
        main.forEach((p) => {
            const template =` 
                    <button class="card" data-priority="primary">
                        <img loading="lazy" src="${p["img"]}" alt="${p["title"]}">
                        <span class="card-title">${p["title"]}</span>
                    </button>`;
            mPHtml.append(template);
        });
    }else{
        mPHtml.children().each(function(){
            const titleElement = $(this).children()[1];
            const titleText = $(titleElement).text();
            const idx = prevMain.findIndex(p => p["title"] === titleText);
            const newTitleText = main.at(idx)["title"];
            $(titleElement).text(newTitleText);
        });
    }
    const sPHtml = $("#secondary-projects");
    if(sPHtml.children().length === 0){
        sec.forEach(p => {
            const template =` 
                    <button class="secondary card" data-priority="secondary">
                        <span class="card-title">${p["title"]}</span>
                    </button>`;
            sPHtml.append(template);
        });
    }
}

function showProject(element){
    const lang = localStorage.getItem("lang") ?? "hun";
    const prior = element.attr("data-priority") === "primary" ? "main-projects" : "secondary-projects";
        const data = langData[lang]["projects-section"][prior].find(p => p["title"] === element.text().trim());

        if(["Szakdolgozat", "Graduate work", "Szakmai gyakorlat", "Internship"].includes(data["title"])) {
            $("#details-panel").addClass("graduate-work");
            $("#details-button-container").addClass("show")

            if(["Szakmai gyakorlat", "Internship"].includes(data["title"])){
                $("#gw").hide();
                $("#gwp").hide();
                $("#demo-link").attr("href", data["demo-link"]).text(langData[lang]["projects-section"]["demo-link"]).show();
            }
            else{
                $("#gw").show();
                $("#gwp").show();
                $("#demo-link").hide();
            }
        }else{
            $("#details-panel").removeClass("graduate-work");
            $("#details-button-container").removeClass("show");
        }

        $("#github-url").attr("href", data["github"]);
        $("#details-img").attr("src", data["img"]).removeClass("zoom");
        $("#details-title").text(data["title"]);
        $("#details-desc").text(data["description"]);

        $("#details-container").addClass("show");
        $("body").addClass("no-scroll");
}

function initilizeChart(){
    var ctx = document.getElementById("chart-canvas");

    const traitsData = [
        { language: "HTML", knowledge: 40 },
        { language: "JavaScript", knowledge: 40 },
        { language: "Angular", knowledge: 40 },
        { language: "Java", knowledge: 20 },
        { language: "C#", knowledge: 40 },
        { language: "C/C++", knowledge: 15 },
        { language: "PHP", knowledge: 10 }
    ]
    new Chart(
        ctx,
        {
            type: 'doughnut',
            data: {
                labels: traitsData.map(d => d.language),
                datasets: [
                    { 
                        data: traitsData.map(d => d.knowledge),
                        backgroundColor: [
                            '#f1662a',
                            '#f2de29',
                            '#e02686',
                            '#f5f5f5',
                            '#2683e0',
                            '#154c84',
                            '#ce0003'
                        ]
                    }
                ]
            },
            options:{
                plugins:{
                    legend:{
                        labels:{
                            color: '#f5f5f5',
                            boxHeight: 20,
                            font:{
                                size: 18
                            }
                        },
                        position: 'left'
                    },
                    tooltip:{
                        enabled: true,
                    }
                }
            }
        }
    )
}