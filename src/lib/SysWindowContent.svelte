<script context="module">
    //each file page has a list of programs and or files and other stuff
    const fileSystem = {
        "/Home": {
            files: ["resume.md","terminal.app","vsCode.app"],
            up: "root",
            folders: {
                "/Desktop": {
                    files: ["Overview.app", "VScode.app", "virtual.app"],
                    up: '',
                    folders: {
                        "/Games": {
                            files: ["MS-Paint", "Snake"], up: "", folders: {
                                "/Skiing": {files: ["ski.md", "ski.md", "ski.md"], up: "", folders: {}},
                                "/Skiing0": {files: ["ski.md", "ski.md", "ski.md"], up: "", folders: {}}
                            }
                        },
                        "/myPgrms": {
                            files: ["MS-Paint", "Snake"], up: "", folders: {
                                "/Skiing": {files: ["ski.md", "ski.md", "ski.md"], up: "", folders: {}},
                                "/Skiing0": {files: ["ski.md", "ski.md", "ski.md"], up: "", folders: {}}
                            }
                        },
                    }
                },
                "/Seanshmulevich": {
                    //these files names are bad in terms of content
                    files: ["passions.md", "hobbies.md", "goals.md", "ideas.md"],
                    up: "",
                    folders: {}
                },
                "/MyProjects": {
                    files: ["projectIdeas.md","Algs.app", "scrape.app", "solana.app", "Algs.md", "solana.md", "scrape.md"],
                    up: "",
                    folders: {
                        "/school": {
                            files: ["a.txt"],
                            up: "",
                            folders: {
                                "/randomFolder": {files: ["ran.md", "affy.md", "hello.md"], up: "", folders: {}},
                                "/randomFolderz": {files: ["ran.md", "affy.md", "hello.md"], up: "", folders: {}}
                            }
                        },
                        "/personal": {
                            files: ["a.txt"],
                            up: "",
                            folders: {}
                        },

                    }
                },

            }
        },

        //only needs to be set by the parent not modified externally.
    }
    //curr is always up.folders
    //hahahaha it works i feel good I did recursion
    //is it fast ? n levels deep of n files.
    //1st call 3x folders each folder gets n calls depending on its number of folders.
    // N levels * folders per level. O(F) == the total amount of folders in the tree. or O(N*F)
    let setFileUp =  ((up, curr) => {
        let currKeys = Object.keys(curr);
        for (let i = 0; i < currKeys.length; i++) {
            const thisFolder = curr[currKeys[i]];
            thisFolder.up = up;
            setFileUp(thisFolder, thisFolder.folders);
        }
    });
    setFileUp(fileSystem['/Home'], fileSystem['/Home'].folders);
</script>
<script>
    import '../css/98.css';
    import '../css/myStyle.css';
    //grid view should be able to be controlled by the parent, use bind value very easy
    //export let gridViewOn = false;

    //init stuff
    export let path = "/Home";
    let filesList;
    let foldersList;

    function getPathObj(str) {
        let pathArr = str.split("/").filter(Boolean);
        let currObj = fileSystem[`/${pathArr[0]}`];
        for (let i = 1; i < pathArr.length; i++) {
            currObj = currObj.folders[`/${pathArr[i]}`];
        }
        return currObj;
    }

    //theres a way to do this using the previous value instead of rerunning the iterations.
    //but like max iterations is like 5, a filepath will never be like 1000 lines long so does it matter that
    //this code can be made to work in constant time. if the json is restructered but then up is not asFast.
    //the structre of the json object also optimizes the find kind of because it knows what direction to go in
    //rather than needing to check all folders of a current folders list it know which one to pick.
    let currObj = getPathObj(path);
    filesList = currObj.files;
    foldersList = Object.keys((currObj.folders));

    function goDeeper(name) {
        currObj = currObj.folders[name];
        filesList = currObj.files;
        foldersList = Object.keys((currObj.folders));
        path += `${name}`;
    }

    function getLastPathIdx(pathStr) {
        let lastIdx = pathStr.length-1;
        let currLett = pathStr.charAt(lastIdx);
        let count = lastIdx;

        //ignore the lastChar / because we want the last full word gone
        if(currLett == '/'){
            currLett = pathStr.charAt(lastIdx-1);
        }
        while (currLett !== '/' && count >= 0)
        {
            count --;
            currLett = pathStr.charAt(count);
        }
        return count;
    }
    //need to search from the start.
    export function goUp() {
        //let pathArr = path.split("/").filter(Boolean);
        if (path === "/Home") return;

        //getLastPathIdx is O(LastWord in path) awesome
        path = path.substring(0, getLastPathIdx(path));
        filesList = currObj.up.files;
        foldersList = Object.keys((currObj.up.folders));
        currObj = currObj.up;
    }

    export function goHome() {
        currObj = getPathObj("/Home");
        let currPath = '/Home';
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