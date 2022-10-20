<script>
    import '../css/98.css';
    import '../css/myStyle.css';

    //grid view should be able to be controlled by the parent, use bind value very easy
    export let gridViewOn = false;

    //each file page has a list of programs and or files and other stuff
    const fileSystem = {
        "/Home": {
            files: ["resume.md"],
            up: "root",
            folders: {
                "/Desktop": {
                    files: ["Overview.app", "VScode.app", "virtual.app"],
                    up: "/Home",
                    folders: {
                        "/Games": {files: ["MS-Paint", "Snake"], up: "/Desktop", folders: {}}
                    }
                },
                "/Seanshmulevich": {
                    //these files names are bad in terms of content
                    files: ["Passions.md", "allAboutMe.md", "CodingHist.md", "unfinished.md"],
                    up: "/Home",
                    folders: {
                        "/Skiing": {files: ["ski.md", "ski.md", "ski.md"], up: "/Seanshmulevich", folders: {}},
                    }
                },
                //okay we have
                //writing about projects ive done and maybe not finished
                //code for projects im proud of along with writeups abt them.
                //actual executable projects
                //about little bash scripts ive made and stuff
                //the top bar will showcase the executables
                //technologies
                //bash, python, frameworks etc.
                //Projects
                //projects code
                ////project writeups
                //projects executables.
                //school.
                "/MyProjects": {
                    files: ["Algs.app", "scrape.app", "solana.app", "Algs.md", "solana.md", "scrape.md"],
                    up: "/Home",
                    folders: {
                        "/school": {
                            files: ["a.txt"],
                            up: "/MyProjects",
                            folders: {
                                "/randomFolder": {files: ["ran.md", "affy.md", "hello.md"], up: "/school", folders: {}}
                            }
                        }
                    }
                },

            }
        },

        //only needs to be set by the parent not modified externally.
    }
    //implement start from current path
    export let path = "/Home";
    let pathArr = path.split("/").filter(Boolean);
    let filesList;
    let foldersList;
    let currObj = fileSystem[`/${pathArr[0]}`];
    //ran on init.
    for (let i = 1; i < pathArr.length; i++) {
        currObj = currObj.folders[`/${pathArr[i]}`];
    }
    filesList = currObj.files;
    foldersList = Object.keys((currObj.folders));

    function goDeeper(name) {
        currObj = currObj.folders[name];
        filesList = currObj.files;
        foldersList = Object.keys((currObj.folders));
        path += `${name}`;
        console.log(path);
    }

    //need to search from the start.
    function goUp() {
        pathArr = path.split("/").filter(Boolean);
        if (pathArr.length === 1) return;
        pathArr.pop();//do not count the last one
        currObj = fileSystem[`/${pathArr[0]}`];
        let currPath = '/Home';
        for (let i = 1; i < pathArr.length; i++) {
            currPath += `/${pathArr[i]}`;
            currObj = currObj.folders[`/${pathArr[i]}`];
        }
        path = currPath;
        filesList = currObj.files;
        foldersList = Object.keys((currObj.folders));
    }

</script>
<div class="window-body" style="justify-content: center;text-align: center;min-height: 250px;">

    <div class="centerText">
        {#each foldersList as folder}
            <div class="exploreIcon" on:dblclick={() => goDeeper(folder)}>
                <img class="menuFileIcon" src="https://win98icons.alexmeub.com/icons/png/directory_closed-5.png"/>
                <p class="filetext">{folder.substring(1)}</p>
            </div>
        {/each}
        {#each filesList as file}
            <div class="exploreIcon" on:dblclick={() => goUp()}>
                <img class="menuFileIcon" src="https://win98icons.alexmeub.com/icons/png/notepad_file-2.png"/>
                <p class="filetext">{file}</p>
            </div>
        {/each}
        {#each filesList as file}
            <div class="exploreIcon" on:dblclick={() => goUp()}>
                <img class="menuFileIcon" src="https://win98icons.alexmeub.com/icons/png/notepad_file-2.png"/>
                <p class="filetext">{file}</p>
            </div>
        {/each}
        {#each filesList as file}
            <div class="exploreIcon" on:dblclick={() => goUp()}>
                <img class="menuFileIcon" src="https://win98icons.alexmeub.com/icons/png/notepad_file-2.png"/>
                <p class="filetext">{file}</p>
            </div>
        {/each}
    </div>

</div>
<style>
    .centerText {
        justify-content: space-evenly;
        display: grid;
        grid-template-columns: 80px 80px 80px 80px;
        grid-template-rows: auto;
        column-gap: 12px;
        margin-top: 23px;
        row-gap: 0px;
    }
</style>