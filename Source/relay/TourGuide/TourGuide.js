//This script is in the public domain.


//Min, max inclusive.
function randomi(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Matrix:
var __matrix_spinners = [];
var __matrix_spinner_counter = 0;
var __matrix_animation_interval = 16;
var __matrix_glyph_size = 16;
var __matrix_animating = false;
var __matrix_timer_id = 1;
var __matrix_last_event_time;

function matrixDrawGlyph(context, glyphs, glyph_index, x_index, y_index, alpha, colour)
{
	if (y_index < 0 || x_index < 0)
		return;
	var gx = glyph_index % 10;
	var gy = Math.floor(glyph_index / 10);
	
	context.globalCompositeOperation = "source-over";
	if (false)
	{
		context.globalAlpha = 1.0;
		context.fillStyle = "rgb(0,0,0)";
		context.fillRect(x_index * __matrix_glyph_size, y_index * __matrix_glyph_size, __matrix_glyph_size, __matrix_glyph_size);
	}
	//context.globalCompositeOperation = "lighter";
	context.globalAlpha = alpha;
	context.drawImage(glyphs, gx * __matrix_glyph_size, gy * __matrix_glyph_size, __matrix_glyph_size, __matrix_glyph_size, x_index * __matrix_glyph_size, y_index * __matrix_glyph_size, __matrix_glyph_size, __matrix_glyph_size);
	//context.globalCompositeOperation = "source-over";
	
	if (colour != "")
	{
		context.globalCompositeOperation = "multiply";
		context.fillStyle = colour; //"rgb(0,127,255)";
		context.fillRect(x_index * __matrix_glyph_size, y_index * __matrix_glyph_size, __matrix_glyph_size, __matrix_glyph_size);
		context.globalCompositeOperation = "source-over";
	}
}


function matrixTick(id)
{
    if (id < __matrix_timer_id) //out of line
        return;
	var context_width = window.innerWidth; //document.body.clientWidth;
	var context_height = window.innerHeight; //document.body.clientHeight;
	var canvas = document.getElementById("matrix_canvas");
    if (canvas == null)
        return;
	var canvas_holder = document.getElementById("matrix_canvas_holder");
    if (canvas_holder == null)
        return;
	var needs_resize = false;
	if (canvas.width != context_width)
		needs_resize = true;
	if (canvas.height != context_height)
		needs_resize = true;
	if (needs_resize)
	{
		var stored_data = undefined;
		try
		{
			//This is an invalid operation on file:// in chrome, so catch and fallback:
			stored_data = canvas.toDataURL();
			var previous_image = new Image;
			//Once the image has been parsed, resize and update:
			previous_image.onload = function()
			{
				canvas.width = context_width;
				canvas.height = context_height;
				canvas.getContext("2d").drawImage(previous_image, 0, 0);
				matrixTick(id);
			}
			previous_image.src = stored_data;
			return;
		}
		catch (exception)
		{
			canvas.width = context_width;
			canvas.height = context_height;
		}
	}
	
	var context = canvas.getContext("2d");
	
	var glyphs = document.getElementById("matrix_glyphs");
	if (glyphs == null)
        return;
	
	var maximum_glyphs_x = Math.ceil(context_width / __matrix_glyph_size);
	var maximum_glyphs_y = Math.ceil(context_height / __matrix_glyph_size);
	
	
	//Fade out:
	if (true)
	{
		//Subtraction method:
		context.globalCompositeOperation = "difference";
		context.fillStyle = "rgb(2, 2, 2)";
		context.globalAlpha = 1.0;
		context.fillRect(0, 0, context_width, context_height);
		context.globalCompositeOperation = "source-over";
	}
	else
	{
		//Alpha method:
		context.fillStyle = "rgb(0,0,0)";
		context.globalAlpha = 1.0 / __matrix_glyph_size; //1.0 / (60.0);
		context.fillRect(0, 0, context_width, context_height);
	}
	
	if (false)
	{
		//Fill the screen:
		for (var y = 0; y < maximum_glyphs_y; y++)
		{
			for (var x = 0; x < maximum_glyphs_x; x++)
			{
				var glyph_index = randomi(0, 102 - 1);
				var alpha = Math.random();
				matrixDrawGlyph(context, glyphs, glyph_index, x, y, alpha, "");
			}
		}
	}
	if (false)
	{
		//Random glyphs:
		for (var i = 0; i < 128; i++)
		{
			var x = randomi(0, maximum_glyphs_x);
			var y = randomi(0, maximum_glyphs_y);
			var glyph_index = randomi(0, 102 - 1);
			var alpha = Math.random();
			matrixDrawGlyph(context, glyphs, glyph_index, x, y, alpha, "");
		}
	}
	
	//Create spinners:
	var spinner_density = (context_width * context_height) / (__matrix_glyph_size * 256);
	while (__matrix_spinners.length < spinner_density)
	{
		var spinner = new Object();
		
		spinner.x_index = randomi(0, maximum_glyphs_x);
		spinner.y_index = randomi(-16, maximum_glyphs_y);
		spinner.alpha = Math.random(); //Math.random() * 0.25 + 0.75;
		spinner.counter = randomi(0, 11);
		spinner.glyph_index = randomi(0, 102 - 1);
		spinner.interval = randomi(1, 15);
		
		__matrix_spinners.push(spinner);
	}
	//Draw spinners:
	var spinners_next = [];
	for (var i = 0; i < __matrix_spinners.length; i++)
	{
		var spinner = __matrix_spinners[i];
		var should_delete = false;
		
		if (spinner.counter % spinner.interval == 0)
		{
			matrixDrawGlyph(context, glyphs, spinner.glyph_index, spinner.x_index, spinner.y_index, spinner.alpha, "");
			spinner.y_index++;
			spinner.glyph_index = randomi(0, 102 - 1);
			if (spinner.y_index > maximum_glyphs_y)
			{
				should_delete = true;
			}
		}
		if (Math.random() < 0.05 / 60.0)
			should_delete = true;
		if (spinner.interval > 1)
		{
			var percentage = ((spinner.counter % spinner.interval) + 1) / (spinner.interval);
			matrixDrawGlyph(context, glyphs, spinner.glyph_index, spinner.x_index, spinner.y_index, spinner.alpha * percentage, "");
		}
		if (!should_delete)
			spinners_next.push(spinner);
		
		spinner.counter++;
	}
	__matrix_spinners = spinners_next;
	__matrix_spinner_counter++;
	
	setTimeout(function() {matrixTick(id)}, __matrix_animation_interval);
}

function matrixStartAnimation()
{
    if (__matrix_animating)
        return;
    __matrix_last_event_time = timeInMilliseconds();
	var canvas_holder = document.getElementById("matrix_canvas_holder");
    
    if (canvas_holder === null)
        return;
    
    __matrix_timer_id++;
	setTimeout(function() {matrixTick(__matrix_timer_id)}, __matrix_animation_interval);
    __matrix_animating = true;
    
    canvas_holder.style.display = "inline";
    canvas_holder.style.visibility = "visible";
    canvas_holder.style.opacity = 0.0;
    canvas_holder.style.transition = "opacity 1.0s";
    canvas_holder.style.opacity = 1.0;
}

function matrixStopAnimation()
{
    if (!__matrix_animating)
        return;
    __matrix_last_event_time = timeInMilliseconds();
    __matrix_timer_id++; //will cancel any running timer
    __matrix_animating = false;
    
	var canvas_holder = document.getElementById("matrix_canvas_holder");
    if (canvas_holder == null)
        return;
    canvas_holder.style.visibility = "hidden";
    
    canvas_holder.style.opacity = 0.0;
}







//Guide:

//Auto-reload code:
var __guide_last_reload_api_response; //saved API response from the last time we reloaded
var __guide_ash_url;
var __guide_last_reload_time; //Date.now(), milliseconds since epoch
var __guide_default_window_size;
var __guide_active_timer;
var __guide_timer_interval = 2000;

var __guide_importance_bar_visible = false;

var __guide_colset_type = -1; //1 for long, 2 for short

var __guide_colset_long_kol_default = "200,3**,*";
var __guide_colset_long_kol_default_regex = /([0-9][0-9]*),(3\*|[0-9][0-9]*%|[0-9][0-9]*|3\*[0-9][0-9]*),[\*0123456789][0-9]*/; //firefox generic matching
var __guide_colset_long_2 = ",3*,25%,20%";
var __guide_colset_long_3_chatpane_slightly_visible = ",3*,30%,0%";
var __guide_colset_long_3_chatpane_invisible = ",3*,30%";

var __guide_colset_long_2_regex = /[0-9][0-9]*,3\*,25%,20%/;
var __guide_colset_long_3_chatpane_slightly_visible_regex = /[0-9][0-9]*,3\*,30%,0%/;
var __guide_colset_long_3_chatpane_invisible_regex = /[0-9][0-9]*,3\*,30%/;
var __guide_observed_long_charpane_size = 200;


var __guide_colset_short_kol_default = "4*,*";
var __guide_colset_short_kol_default_regex = /(4\*|[0-9][0-9]*%),[\*0123456789][0-9]*/; //firefox generic matching
var __guide_colset_short_2 = "*,25%,20%";
var __guide_colset_short_3_chatpane_slightly_visible = "*,30%,0%";
var __guide_colset_short_3_chatpane_invisible = "*,30%";

var default_settings = {};
var informational_settings = {};

const default_default_settings = {
    "rollover_AE":"false",
    "ascension_AE":"false",
    "opacity":"half",
    "image":"small",
    "collapsing":"entries"
};


function timeInMilliseconds()
{
    if (Date.now == undefined) //IE8 compatibility
        return Number(new Date);
    return Date.now();
}

function mainWindow()
{
	var overall_window = window;
    var breakout = 100; //prevent loops, if somehow that happened
	while (overall_window.parent != undefined && overall_window.parent != overall_window && breakout > 0)
    {
		overall_window = overall_window.parent;
        breakout--;
    }
	return overall_window;
}

function removeInstalledFrame()
{
    try
    {
        var overall_window = mainWindow();
        var rootset = overall_window.frames["rootset"];
        if (rootset == undefined)
            return;
        
        var saved_colset = undefined;
        try
        {
            //storage API requires try
            saved_colset = sessionStorage.getItem("Guide initial colset");
        }
        catch (e)
        {
        }
        
        if (overall_window.frames["Guide Frame"] == undefined)
            return;
        rootset.removeChild(rootset.children["Guide Frame"]);
        
        
        if (saved_colset != undefined)
            rootset.cols = saved_colset;
        else if (__guide_colset_type == 2)
            rootset.cols = __guide_colset_short_kol_default;
        else
            rootset.cols = __guide_colset_long_kol_default;
    }
    catch (e)
    {
    }
}


function getChatIsCurrentlyActive()
{
    var rootset = mainWindow().frames["rootset"];
	if (rootset == undefined)
		return false;
    try
    {
        //Test the URL of the chatpane:
        var url = rootset.children["chatpane"].contentDocument.URL;
        if (url.indexOf("chatlaunch.php") != -1)
            return false;
        if (url.indexOf("mchat.php") != -1) //Modern chat
            return true;
        if (url.indexOf("chat.html") != -1) //Older Chat
            return true;
        if (url.indexOf("chat.php") != -1) //Ancient Chat
            return true;
        //Will miss any chat URLs we don't know about.
    }
    catch (e)
    {
    }
    return false;
}

function getCurrentlyInsideMainpane()
{
	return (window.self != window.top && window.name == "mainpane");
}

function verifyKOLPageIsUnaltered()
{
    try
    {
        //if (mainWindow().frames["rootset"].cols != "4*,*")
        __guide_colset_type = -1;
        var rootset_cols = mainWindow().frames["rootset"].cols;
        var long_matches = rootset_cols.match(__guide_colset_long_kol_default_regex);
        if (long_matches)
        {
            __guide_colset_type = 1;
            if (long_matches.length >= 2)
            {
                __guide_observed_long_charpane_size = long_matches[1];
            }
        }
        else if (rootset_cols.match(__guide_colset_short_kol_default_regex))
            __guide_colset_type = 2;
        else if (rootset_cols === __guide_colset_long_kol_default)
            __guide_colset_type = 1;
        else if (rootset_cols === __guide_colset_short_kol_default)
            __guide_colset_type = 2;
        
        if (__guide_colset_type === -1)
            return false;
        
        if (document.getElementById("button_close_box") == undefined)
            return false;
        
        return true;
    }
    catch (e)
    {
    }
    return false;
}

function getCurrentInstalledFramePosition()
{
    try
    {
        if (mainWindow().frames["Guide Frame"] === undefined)
            return
        //Bit hacky, examine what we've done to cols:
        var rootset = mainWindow().frames["rootset"];
        if (rootset.cols.match(__guide_colset_long_2_regex))
        {
            __guide_colset_type = 1;
            return 2;
        }
        else if (rootset.cols.match(__guide_colset_long_3_chatpane_slightly_visible_regex) || rootset.cols.match(__guide_colset_long_3_chatpane_invisible_regex))
        {
            __guide_colset_type = 1;
            return 3;
        }
        
        if (rootset.cols === __guide_colset_short_2)
        {
            __guide_colset_type = 2;
            return 2;
        }
        else if (rootset.cols == __guide_colset_short_3_chatpane_slightly_visible || rootset.cols == __guide_colset_short_3_chatpane_invisible)
        {
            __guide_colset_type = 2;
            return 3;
        }
    }
	catch (e)
    {
    }
	return -1;
}

function installFrame(position)
{
    try
    {
        if (__guide_colset_type != 1 && __guide_colset_type != 2)
            return;
        var overall_window = mainWindow();
        var rootset = overall_window.frames["rootset"];
        if (rootset == undefined)
            return;

        if (position == getCurrentInstalledFramePosition())
            return;
        
        var chat_active = getChatIsCurrentlyActive();
        var avoid_storing_session_data = false;
        if (overall_window.frames["Guide Frame"] != undefined)
        {
            removeInstalledFrame();
            avoid_storing_session_data = true;
        }

        
        //Positions:
        //-1 - Unknown
        //1 - Left of everything. Disabled for now.
        //2 - Left of chat pane, chat pane visible
        //3 - Left of chat pane, chat pane invisible
        //4 - Right of everything. Disabled for now.
        if (!avoid_storing_session_data)
        {
            try
            {
                //the storage API does not seem to have a way to detect if this method throws an exception, so specifically catch it:
                sessionStorage.setItem("Guide initial colset", rootset.cols);
            }
            catch (e)
            {
            }
        }
        
        var new_frame = overall_window.document.createElement("frame");
        new_frame.name = "Guide Frame";
        new_frame.id = "Guide Frame";
        new_frame.src = __guide_ash_url;
        if (position == 2)
        {
            rootset.insertBefore(new_frame, rootset.children["chatpane"]);
            if (__guide_colset_type === 1)
                rootset.cols = __guide_observed_long_charpane_size + __guide_colset_long_2;
            else if (__guide_colset_type === 2)
                rootset.cols = __guide_colset_short_2;
            //rootset.cols = "*,25%,20%";
        }
        else if (position == 3)
        {
            rootset.insertBefore(new_frame, rootset.children["chatpane"]);
            if (chat_active)
            {
                if (__guide_colset_type === 1)
                    rootset.cols = __guide_observed_long_charpane_size + __guide_colset_long_3_chatpane_slightly_visible;
                else if (__guide_colset_type === 2)
                    rootset.cols = __guide_colset_short_3_chatpane_slightly_visible;
            }
            else
            {
                if (__guide_colset_type === 1)
                    rootset.cols = __guide_observed_long_charpane_size + __guide_colset_long_3_chatpane_invisible;
                else if (__guide_colset_type === 2)
                    rootset.cols = __guide_colset_short_3_chatpane_invisible;
            }
            /*if (chat_active)
                rootset.cols = "*,30%,0%";
            else
                rootset.cols = "*,30%";*/
        }
    }
    catch (e)
    {
    }
}

function buttonCloseClicked(event)
{
	removeInstalledFrame();
}

function buttonNewWindowClicked(event)
{
    openInNewWindow(event,false);
    buttonCloseClicked(event);
}

function buttonRightLeftClicked(event)
{
    if (getCurrentInstalledFramePosition() != 3)
        return;
    installFrame(2);
}

function buttonRightRightClicked(event)
{
    if (getCurrentInstalledFramePosition() != 2)
        return;
    installFrame(3);
}

function buttonExpandAllClicked(event)
{
    //hide this button (only shows if at least 1 tile is minimized)
    document.getElementById('button_expand_all').style.visibility = "";
    
    //expand every currently minimized tile
    const every_toggle_boxen = document.getElementsByClassName( "r_cl_minimize_button" );
    for (const element of every_toggle_boxen)
    {
        if (element.title == "Minimize") continue;
        
        element.title = "Minimize";
        element.alt = "Minimize";
        element.textContent = "▲";
    }
    
    const currently_minimized_tiles = Array.from( document.getElementsByClassName( "r_cl_collapsed" ) );
    for (const element of currently_minimized_tiles)
    {
        element.classList.remove("r_cl_collapsed");
    }
    
    //delete the minimized tiles cache
    try
    {
        localStorage.setItem( `${document.getElementById("player_name").textContent}_TourGuide_collapsed_tiles`, "[]" );
    }
    catch (e) {}
}

function updateExpandAllButtonVisibility()
{
    var expand_all_button = document.getElementById('button_expand_all');
    
    var currently_minimized_tiles = document.getElementsByClassName( "r_cl_collapsed" );
    let stored_minimized_tiles;
    try
    {
        stored_minimized_tiles = JSON.parse(localStorage.getItem( `${document.getElementById("player_name").textContent}_TourGuide_collapsed_tiles` ));
    }
    catch (e)
    {
        stored_minimized_tiles = [];
    }
    if (stored_minimized_tiles == null)
        stored_minimized_tiles = [];
    
    if (currently_minimized_tiles.length == 0 && stored_minimized_tiles.length == 0)
        expand_all_button.style.visibility = "";
    else
        expand_all_button.style.visibility = "visible";
}

function installFrameDefault(event)
{
    if (getChatIsCurrentlyActive())
        installFrame(2);
    else
        installFrame(3);
}

function recalculateImportanceBarVisibility(test_position, relevant_container, initial)
{
    var scroll_position = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
    var desired_visibility = false;
    if (scroll_position > test_position)
        desired_visibility = true;
    if (__guide_importance_bar_visible != desired_visibility)
    {
        if (relevant_container == undefined)
            return;
        
        var gradient_container = document.getElementById("importance_bar_gradient");
        var saved_class_name;
        if (initial && gradient_container != undefined)
        {
            saved_class_name = gradient_container.className;
            gradient_container.className += "r_no_css_transition"; //don't fade in if we have already
        }
        if (!desired_visibility)
        {
            relevant_container.style.visibility = "hidden";
            //relevant_container.style.pointerEvents = "none";
            if (gradient_container != undefined)
                gradient_container.style.opacity = "0.0";
        }
        else
        {
            relevant_container.style.visibility = "visible";
            //relevant_container.style.pointerEvents = "auto";
            if (gradient_container != undefined)
                gradient_container.style.opacity = "0.75";
        }
        if (initial && gradient_container != undefined)
        {
            gradient_container.offsetHeight; //browser hack to make no_css_transition apply
            gradient_container.className = saved_class_name;
        }
        __guide_importance_bar_visible = desired_visibility;
    }
}

function elementGetGlobalOffsetTop(element)
{
    if (element == undefined)
        return 0.0;
    //Recurse upward:
    var offset = 0.0;
    var breakout = 100; //prevent loops, if somehow that happened
    while (breakout > 0 && element != undefined)
    {
        offset += element.offsetTop;
        element = element.parentElement;
        breakout--;
    }
    return offset;
}

function writePageExtras()
{
	var editable_area_top = document.getElementById("extra_words_at_top");
	var did_output_install_to_window_link = false;
    
    var page_unaltered = verifyKOLPageIsUnaltered();
    if (getCurrentlyInsideMainpane() && page_unaltered)
    {
        //auto install:
        installFrameDefault();
        //we considered using window.history.back(), but what if it's adventure.php?
        window.location = "main.php"; //visit the map
    }
    else
    {
        if (page_unaltered && getCurrentlyInsideMainpane() && getCurrentInstalledFramePosition() == -1)
        {
            editable_area_top.innerHTML += "<br><span style=\"font-weight:bold;font-size:1.2em;\"><a href=\"main.php\" onclick=\"installFrameDefault(event);\">Install into window</a></span>";
            did_output_install_to_window_link = true;
        }
        
        if (getCurrentlyInsideMainpane())
        {
            //just loaded
            if (did_output_install_to_window_link)
                editable_area_top.innerHTML += "<br>";
            editable_area_top.innerHTML += "<br><span style=\"font-weight:bold;font-size:1.2em;\"><a href=\"" + __guide_ash_url + "\" onclick=\"openInNewWindow(event,true);\">Open in a new window</a></span>"; //large, friendly letters
        }
    }
    var frame_id = "";
    if (window.frameElement != undefined)
        frame_id = window.frameElement.id;
    if (frame_id == "Guide Frame")
	{
		//in frame
        try
        {
            document.getElementById("button_close_box").style.visibility = "visible";
            
            document.getElementById("button_new_window").style.visibility = "visible";
            
            document.getElementById("button_refresh").style.visibility = "visible";
            
            var current_position = getCurrentInstalledFramePosition();
            
            if (current_position == 3)
            {
                document.getElementById("button_arrow_right_left").style.visibility = "visible";
            }
            if (current_position == 2)
            {
                document.getElementById("button_arrow_right_right").style.visibility = "visible";
            }
        }
        catch (e) //buttons may not be there
        {
        }
	}
    document.getElementById("refresh_status").innerHTML = ""; //clear out disabled message
    
    
    //Load user settings from localStorage
    const settings = loadSettings();
    for (const [category, category_settings] of Object.entries(settings))
    {
        if (category == "__default")
        {
            default_settings = category_settings;
            let guide_body_classes = document.getElementById("Guide_body").classList;
            
            for (const [setting, value] of Object.entries(default_default_settings))
            {
                //If they didn't set a default for some values yet, set ours
                if (!Object.keys(default_settings).includes(setting))
                {
                    default_settings[setting] = value;
                }
                
                //Apply the default to the page
                guide_body_classes.add(setting + "_" + default_settings[setting]);
            }
        }
        else
        {
            for (const tile of document.getElementsByClassName(category))
            {
                let tile_classes = tile.classList;
                
                for (const [setting, value] of Object.entries(category_settings))
                {
                    tile_classes.add(setting + "_" + value);
                }
            }
        }
    }
    
    //There's issues with adding a right-click event to SVGs on Firefox, so add it manually
    const button_global_settings = document.getElementById("button_global_settings");
    if (button_global_settings.oncontextmenu == null)
        button_global_settings.addEventListener("contextmenu", function(){ callSettingsContextualMenu(event); });
    
    //Load minimized tiles from localStorage
    let groups_to_minimize;
    try
    {
        groups_to_minimize = JSON.parse(localStorage.getItem( `${document.getElementById("player_name").textContent}_TourGuide_collapsed_tiles` ));
    }
    catch (e) {}
    
    if (!Array.isArray(groups_to_minimize))
        groups_to_minimize = [];
    
    //auto-expansion
    informational_settings["ascension"] = document.getElementById("ascension_count").textContent;
    informational_settings["game_day"] = document.getElementById("in_game_day").textContent;
    if (informational_settings["ascension"] != default_settings["ascension"]) //on ascension
    {
        //"informational_settings" has the current ascension, and "default_settings" has the logged one. A difference means they ascended since last load.
        for (const [category, category_settings] of Object.entries(settings))
        {
            if (category == "__default" && default_settings["ascension_AE"] == "true")
            {
                //all collapsed tiles (that don't have personal settings for that matter) need to be expanded. Parse them all.
                let groups_to_minimize_cache = groups_to_minimize.slice(); //save the modified version here, otherwise the "for" loop has issues
                for (const collapsed_tile of groups_to_minimize)
                {
                    if (Object.keys(settings).includes(collapsed_tile))
                    {
                        if (Object.keys(settings[collapsed_tile]).includes("ascension_AE")) //This tile has its own setting for what to do with auto-expansion on ascension, so don't even try to handle it here.
                            continue;
                    }
                    groups_to_minimize_cache.splice(groups_to_minimize_cache.indexOf(collapsed_tile), 1);
                }
                groups_to_minimize = groups_to_minimize_cache.slice();
            }
            else if (category != "__default" && category_settings["ascension_AE"] == "true")
            {
                if (groups_to_minimize.includes(category))
                {
                    groups_to_minimize.splice(groups_to_minimize.indexOf(category), 1);
                }
            }
        }
        
        default_settings["ascension"] = informational_settings["ascension"];
        try
        {
            localStorage.setItem( `${document.getElementById("player_name").textContent}_TourGuide_collapsed_tiles` , JSON.stringify(groups_to_minimize) );
        }
        catch (e) {}
    }
    if (informational_settings["game_day"] != default_settings["game_day"]) //on rollover
    {
        //will fail if it's been exactly 95 days since last login (a KoL year), but at that point, who cares
        for (const [category, category_settings] of Object.entries(settings))
        {
            if (category == "__default" && default_settings["rollover_AE"] == "true")
            {
                let groups_to_minimize_cache = groups_to_minimize.slice();
                for (const collapsed_tile of groups_to_minimize)
                {
                    if (Object.keys(settings).includes(collapsed_tile))
                    {
                        if (Object.keys(settings[collapsed_tile]).includes("rollover_AE"))
                            continue;
                    }
                    groups_to_minimize_cache.splice(groups_to_minimize_cache.indexOf(collapsed_tile), 1);
                }
                groups_to_minimize = groups_to_minimize_cache.slice();
            }
            else if (category != "__default" && category_settings["rollover_AE"] == "true")
            {
                if (groups_to_minimize.includes(category))
                {
                    groups_to_minimize.splice(groups_to_minimize.indexOf(category), 1);
                }
            }
        }
        
        default_settings["game_day"] = informational_settings["game_day"];
        try
        {
            localStorage.setItem( `${document.getElementById("player_name").textContent}_TourGuide_collapsed_tiles` , JSON.stringify(groups_to_minimize) );
        }
        catch (e) {}
    }
    
    saveSettingsCategory("__default", default_settings);
    
    
    //Minimize tiles based on localStorage
    for (const group_to_minimize of groups_to_minimize)
    {
        const corresponding_box_id = "toggle_" + group_to_minimize;
        const corresponding_toggle_boxen = document.getElementsByClassName( corresponding_box_id );
        if (corresponding_toggle_boxen.length != 0) //only want to know if there's at least 1
            toggleTileDisplay(corresponding_box_id, true);
    }
    updateExpandAllButtonVisibility();
    
    const importance_container = document.getElementById("importance_bar");
    if (importance_container != undefined)
    {
        __guide_importance_bar_visible = false;
        const tasks_position = elementGetGlobalOffsetTop(document.getElementById("Tasks_checklist_container")) + 1;
        
        recalculateImportanceBarVisibility(tasks_position, importance_container, true)
        
        window.onscroll = function (event) { recalculateImportanceBarVisibility(tasks_position, importance_container, false); };
    }
    else
        window.onscroll = undefined;
}

function updatePageHTML(body_response_string)
{
	if (body_response_string.length < 11)
		return;
	//Somewhat hacky way of reloading the page:
    matrixStopAnimation();
    
    //Save display style for two tags:
    //r_location_popup_blackout r_location_popup_box
    var elements_to_save_properties_of = ["r_location_popup_blackout", "r_location_popup_box"];
    var saved_opacity_of_element = [];
    var saved_bottom_of_element = [];
    var saved_visibility_of_element = [];
    
    for (var i = 0; i < elements_to_save_properties_of.length; i++)
    {
        var element_id = elements_to_save_properties_of[i];
        var element = document.getElementById(element_id);
        if (element == undefined)
            continue;
        if (element.style == undefined)
            continue;
        saved_opacity_of_element[element_id] = element.style.opacity;
        saved_bottom_of_element[element_id] = element.style.bottom;
        saved_visibility_of_element[element_id] = element.style.visibility;
    }
    
    window.onscroll = undefined;
    
    document.body.innerHTML = body_response_string;
    
    
    //Restore style tag:
    for (var element_id in saved_opacity_of_element)
    {
        if (!saved_opacity_of_element.hasOwnProperty(element_id))
            continue;
        
        var opacity = saved_opacity_of_element[element_id];
        var bottom = saved_bottom_of_element[element_id];
        
        if (opacity == undefined || bottom == undefined)
            continue;
        var element = document.getElementById(element_id);
        if (element == undefined)
            continue;
        if (element.style == undefined)
            continue;
        
        var saved_transition = element.style.transition;
        element.style.transition = "";
        
        element.style.opacity = opacity;
        element.style.visibility = saved_visibility_of_element[element_id];
        if (element_id === "r_location_popup_box" && !(bottom === "4.59em"))
        {
            element.style.bottom = "-" + element.clientHeight + "px";
        }
        else
            element.style.bottom = bottom;
        
        element.offsetHeight; //force movement
        element.style.transition = saved_transition;
    }
    writePageExtras();
}

function issueTimer()
{
    if (__guide_active_timer != undefined) //one is potentially already active, cancel it
        clearTimeout(__guide_active_timer);
    __guide_active_timer = setTimeout(function() {checkForUpdate()}, __guide_timer_interval);
}

function recalculateTimerInterval()
{
    __guide_timer_interval = 2000; //absolute base
    
    //Scaling timer:
    //We check the last time we needed to reload. If it's been a while, we slow down our timer to limit wake-ups on laptops, as well as KoLmafia load.
    //This may have consistency problems - if so, go back to using a fixed setInterval.
    if (__guide_last_reload_time == undefined)
    	__guide_last_reload_time = timeInMilliseconds();
    
    var seconds_since_last_reload = (timeInMilliseconds() - __guide_last_reload_time) / 1000.0;
    if (seconds_since_last_reload < 11) //clicking
    	__guide_timer_interval = 500;
    else if (seconds_since_last_reload < 60) //thinking
    	__guide_timer_interval = 1250;
    else if (seconds_since_last_reload < 60 * 5) //off for a cup of tea
    	__guide_timer_interval = 2500;
    else //huddled in the corner afraid of ascension
    	__guide_timer_interval = 4000;
    
    if (__matrix_last_event_time == undefined)
    	__matrix_last_event_time = timeInMilliseconds();
    var seconds_since_last_matrix_event = (timeInMilliseconds() - __matrix_last_event_time) / 1000.0;
    var matrix_activation_time = 5 * 60;
    if (Math.min(seconds_since_last_reload, seconds_since_last_matrix_event) > matrix_activation_time && !__matrix_animating)
        matrixStartAnimation();
}

function updatePageAndFireTimer()
{
	__guide_last_reload_time = timeInMilliseconds();
	//We issue a special form request for only the body tag's contents, which we then change.
	var request = new XMLHttpRequest();
	request.onerror = function() { issueTimer(); }
	request.onabort = function() { issueTimer(); }
	request.ontimeout = function() { issueTimer(); }
	request.onreadystatechange = function() { if (request.readyState == 4) { if (request.status == 200) { updatePageHTML(request.responseText);} issueTimer(); } }
	var form_data = "body tag only=true";
	
	request.open("POST", __guide_ash_url);
	request.send(form_data);
}

function parseAPIResponseAndFireTimer(response_string)
{
	//API provided, let's see if anything's changed:
	var should_update = false;
    var should_save = true;
	try
	{
		response = JSON.parse(response_string);
	}
	catch (exception)
	{
        issueTimer();
		return;
	}
	if (__guide_last_reload_api_response == undefined) //first update, just save
	{
		__guide_last_reload_api_response = response;
        issueTimer();
		return;
	}
    else
    {
        if (response["logged in"] === "false" && __guide_last_reload_api_response["logged in"] === "true")
            return;
        if (response["need to reload"] === "true")
        {
            should_update = true;
            should_save = false;
        }
        else
        {
            //Check if anything significant (i.e. worth a reload) has changed.
            //This is a bit tricky, because things like free runs or talking to the council can change state without changing turns played.
            //Detecting all of these is impossible. Detecting most of these, though...
            //It's safe to reload often, so we check a lot of these. The only server hit we incur is to the quest log, when a quest is in progress. We have internal rate-limiting code so that only happens once every so often. So, we want to err on providing accurate information, rather than reducing KoLmafia load.
            
            //if we aren't logged in but we were before, don't reload:
            
            for (var property_name in response)
            {
                if (!response.hasOwnProperty(property_name))
                    continue;
                if (response[property_name] != __guide_last_reload_api_response[property_name])
                    should_update = true;
            }
        }
    }
    //should_update = true; //continually refresh for testing
	if (should_update)
	{
        if (should_save)
            __guide_last_reload_api_response = response;
		updatePageAndFireTimer();
	}
    else
        issueTimer();
}

function checkForUpdate()
{
	//Ask our ash's API what our status is:
	var form_data = "API status=true";
    
    
    recalculateTimerInterval();
	
	var request = new XMLHttpRequest();
    //Issue our next timer on load/error/abort. That way, mafia won't be overloaded. Is this okay? Will they always re-issue? What about timeouts?
    //FIXME add in a backup timer in case this method doesn't work? Don't know.
    
    //If error/abort/timeout happens, simply reissue the timer:
	request.onerror = function() { issueTimer(); }
	request.onabort = function() { issueTimer(); }
	request.ontimeout = function() { issueTimer(); }
	request.onreadystatechange = function() { if (request.readyState == 4) { if (request.status == 200) { parseAPIResponseAndFireTimer(request.responseText); } else issueTimer(); } }
	request.open("POST", __guide_ash_url);
	request.send(form_data);
}

function openInNewWindow(event, go_back)
{
    //Kind of hacky.
    if (event.button == 0) //regular click. not middle click or anything else.
    {
        //Open new window, go to main.php
        //If we did this with target=_blank, we couldn't control how the window looks.
        window.open(__guide_ash_url,'Guide','width=' + __guide_default_window_size + ',height=65536,left=0,resizable,scrollbars,status=no,toolbar=no,fullscreen=no,channelmode=no,location=no');
        if (go_back)
        {
            window.location = "main.php"; //visit the map
            try
            {
                event.preventDefault(); //href is to ourselves. Cancel that load, let's visit the map instead.
            }
            catch (exception)
            {
                //unsupported in IE8, just fall through
            }
            return false; //backup method to the cancel method above. Not sure if it works.
        }
    }
    return true;
}

function GuideInit(ash_url, default_window_size)
{
    __guide_ash_url = ash_url;
    __guide_default_window_size = default_window_size;
    
    //var __active_timer_event = setInterval(function() {checkForUpdate()}, 2000);
    checkForUpdate(); //starts off the timer
    writePageExtras();
}

function navbarClick(event, checklist_div_id)
{
    //When the importance bar is visible, we need to adjust our scroll position to take it into account.
    //We also have a fallback in case javascript is disabled - plain anchor tags.
    try
    {
        var container_position = elementGetGlobalOffsetTop(document.getElementById(checklist_div_id)) + 1;
        var importance_container = document.getElementById("importance_bar");
        if (importance_container != undefined && checklist_div_id != "Tasks_checklist_container")
        {
            var importance_bar_height = importance_container.offsetHeight;
            container_position -= importance_bar_height;
        }
        
        window.scrollTo(0, container_position);
        event.preventDefault(); //cancel regular click, will cause an exception in IE8
    }
    catch (exception)
    {
    }
    return false; //cancel regular click
}

var __tested_pointer_events = false;
var __browser_probably_supports_pointer_events = false;
function browserProbablySupportsPointerEvents()
{
    if (!__tested_pointer_events)
    {
        var testing_element = document.createElement("pointerEventsTest");
        testing_element.style.cssText='pointer-events:auto';
        __browser_probably_supports_pointer_events = (testing_element.style.pointerEvents === 'auto');
        __tested_pointer_events = true;
    }
    return __browser_probably_supports_pointer_events;
}

function alterSubentryMinimization(event)
{
    toggleTileDisplay(event.target.id, event.target.title == "Minimize");
}

function toggleTileDisplay(toggle_box_id, want_collapsed)
{
    //First, set the box(es) to the appropriate state
    const toggle_boxen = document.getElementsByClassName( toggle_box_id );
    for (const toggle_box of toggle_boxen)
    {
        if (want_collapsed)
        {
            toggle_box.title = "Expand";
            toggle_box.alt = "Expand";
            toggle_box.textContent = "▲"; // &#9650;
        }
        else
        {
            toggle_box.title = "Minimize";
            toggle_box.alt = "Minimize";
            toggle_box.textContent = "▼"; // &#9660;
        }
    }


    //Second, toggle the collapsing of every matching element
    const class_to_toggle = toggle_box_id.substring(7); //remove the "toggle_"
    const entry_group = document.getElementsByClassName( class_to_toggle );
    for (const element of entry_group)
    if (want_collapsed)
        {
            if (!element.classList.contains("r_cl_collapsed"))
                element.classList.add("r_cl_collapsed");
            let position = Array.prototype.slice.call( element.parentElement.children );
            element.dataset.position = position.indexOf( element );
            element.parentElement.append( element );
        }
        else
        {
            element.classList.remove("r_cl_collapsed");
            element.parentElement.insertBefore(element, element.parentElement.childNodes[element.dataset.position]);
        }
    }


    //Third, update Local storage
    const storage_name = `${document.getElementById("player_name").textContent}_TourGuide_collapsed_tiles`;
    let current_stored_collapsed;
    let to_write;
    try
    {
        current_stored_collapsed = JSON.parse(localStorage.getItem( storage_name ));
    }
    catch (e)
    {
        current_stored_collapsed = [];
    }
    if (current_stored_collapsed == null || !Array.isArray(current_stored_collapsed))
        current_stored_collapsed = [];
    
    if (want_collapsed)
    {
        if (!(current_stored_collapsed.includes( class_to_toggle )))
        {
            try
            {
                current_stored_collapsed.push( class_to_toggle );
                to_write = JSON.stringify(current_stored_collapsed);
                localStorage.setItem( storage_name , to_write );
            }
            catch (e) {}
        }
    }
    else
    {
        if (current_stored_collapsed.includes( class_to_toggle ))
        {
            try
            {
                current_stored_collapsed.splice( current_stored_collapsed.indexOf( class_to_toggle ), 1 );
                to_write = JSON.stringify(current_stored_collapsed);
                localStorage.setItem( storage_name , to_write );
            }
            catch (e) {}
        }
    }


    //Fourth, update the visibility of the expand all button
    updateExpandAllButtonVisibility();
}

var button_currently_attached_to_menu;
function callSettingsContextualMenu(event)
{
    event.preventDefault();

    const sourceButton = event.currentTarget;
    button_currently_attached_to_menu = sourceButton;

    const menu = document.querySelector(".menu");

    //Positioning
    menu.style.display = "flex";
    if (sourceButton.id == "button_global_settings")
    {
        menu.style.top = sourceButton.style.top;
        menu.style.setProperty('--left-of-parent-button', `calc( ${sourceButton.style.right} + ${sourceButton.scrollWidth}px )`);
    }
    else
    {
        menu.style.top = `${sourceButton.offsetTop}px`;
        menu.style.setProperty('--left-of-parent-button', `calc( var(--cl_container_padding) + ${sourceButton.offsetWidth}px )`);
    }
    menu.style.right = 'var( --left-of-parent-button )';
    menu.style.maxWidth = 'calc( 100% - var( --left-of-parent-button ) - 30px)';

    if (sourceButton.id == "button_global_settings")
    {
        document.getElementById("contextual_menu_header_text").textContent = "Global settings";
        //document.getElementById("contextual_menu_trace").textContent = "";
        //document.getElementById("contextual_menu_current_node").textContent = "Settings";
        
        for (const setting of document.getElementsByClassName("ct_menu_choice_setting"))
        {
            const setting_id = setting.id;

            const default_setting = document.getElementById("default_" + setting_id);
            default_setting.textContent = "";
            default_setting.style.display = "none";
            
            setting.value = default_default_settings[setting_id];
            
            for (const option of setting.options)
            {
                if (option.value == default_settings[setting_id])
                    setting.value = option.value;
            }
        }
    }
    else
    {
        const tile_id = sourceButton.id.substring(7);
        document.getElementById("contextual_menu_header_text").textContent = tile_id;
        //document.getElementById("contextual_menu_trace").textContent = "";
        //document.getElementById("contextual_menu_current_node").textContent = "Settings";
        
        const user_settings = loadSettingsCategory(tile_id);
        for (const setting of document.getElementsByClassName("ct_menu_choice_setting"))
        {
            const setting_id = setting.id;

            const default_setting = document.getElementById("default_" + setting_id);
            default_setting.style.display = "";
            
            setting.value = "default";
            
            let default_display_value;
            
            for (const option of setting.options)
            {
                if (option.value == default_settings[setting_id])
                    default_display_value = option.textContent;
                
                if (option.value == user_settings[setting_id])
                    setting.value = option.value;
            }
            
            default_setting.textContent = "default (" + default_display_value + ")";
        }
    }
    
    if (document.getElementById("settings_help_button").title == "Hide help text")
    {
        alterSettingsHelpDisplay();
    }
}

window.addEventListener("click", e => {
    const menu = document.querySelector(".menu");
    if (menu.style.display != "none" && e.target.closest(".r_cl_minimize_button") != button_currently_attached_to_menu && e.target.closest(".r_button") != button_currently_attached_to_menu && e.target.closest(".menu") != menu)
    {
        menu.style.display = "none";
    }
});

function registerSettingsChange(event)
{
    const changed_setting = event.currentTarget; //the <select>
    const setting_id = changed_setting.id;
    //what it was changed to: changed_setting.value
    //selected option (as element) : changed_setting.selectedOptions[0]
    //all possible options (as a list of elements, in order) : changed_setting.options

    const menu_header = document.getElementById("contextual_menu_header_text").textContent;
    const default_setting_was_changed = menu_header == "Global settings";
    
    let category_settings;
    if (default_setting_was_changed)
    {
        category_settings = loadSettingsCategory("__default");
        default_settings[setting_id] = changed_setting.value;
        category_settings[setting_id] = changed_setting.value;
        saveSettingsCategory("__default", category_settings);
    }
    else
    {
        category_settings = loadSettingsCategory(menu_header);
        if (changed_setting.value == "default")
            delete category_settings[setting_id];
        else
            category_settings[setting_id] = changed_setting.value;
        saveSettingsCategory(menu_header, category_settings);
    }
    
    
    //apply modifications to page
    if (default_setting_was_changed)
    {
        let guide_body_classes = document.getElementById("Guide_body").classList;
        for (const element of guide_body_classes.values())
        {
            if (element.startsWith(setting_id))
                guide_body_classes.remove(element);
        }
        
        guide_body_classes.add(setting_id + "_" + changed_setting.value);
    }
    else
    {
        for (const tile of document.getElementsByClassName(menu_header))
        {
            let tile_classes = tile.classList;
            for (const element of tile_classes.values())
            {
                if (element.startsWith(setting_id))
                    tile_classes.remove(element);
            }
            
            if (changed_setting.value != "default")
            {
                tile_classes.add(setting_id + "_" + changed_setting.value);
            }
        }
    }
}

function alterSettingsHelpDisplay()
{
    const help_button = document.getElementById("settings_help_button");
    const show = help_button.title == "\"What is this?\"";
    const help_text = document.getElementById("ct_menu_help");
    const ct_menu_choice_groups = document.getElementsByClassName("ct_menu_choice_group");
    if (show)
    {
        for (const choice_group of ct_menu_choice_groups)
        {
            choice_group.style.display = "none";
        }
        help_text.style.display = "block";
        help_button.title = "Hide help text";
        help_button.style.backgroundColor = "lightgreen";
    }
    else
    {
        for (const choice_group of ct_menu_choice_groups)
        {
            choice_group.style.display = "";
        }
        help_text.style.display = "none";
        help_button.title = "\"What is this?\"";
        help_button.style.backgroundColor = "lightcyan";
    }
}

function saveSettings(user_settings)
{
    try
    {
        localStorage.setItem( `${document.getElementById("player_name").textContent}_TourGuide_settings` , JSON.stringify(user_settings) );
    }
    catch (e) {}
}

function saveSettingsCategory(category, category_settings)
{
    let user_settings = loadSettings();
    user_settings[category] = category_settings;
    if (Object.values(user_settings[category]).length == 0)
        delete user_settings[category];
    saveSettings(user_settings);
}

function loadSettings()
{
    let saved_settings;
    try
    {
        saved_settings = JSON.parse( localStorage.getItem( `${document.getElementById("player_name").textContent}_TourGuide_settings` ) );
    }
    catch (e) {}
    
    //Make sure they are all Objects
    if (!(saved_settings instanceof Object)) //If they are another primitive type (including null or undefined, which would trigger an error in the next check)
    {
        saved_settings = {};
    }
    if (saved_settings.constructor != Object) //If they are another kind of Object, like Array or Map
    {
        saved_settings = {};
    }
    
    for (const [category, category_settings] of Object.entries(saved_settings))
    {
        if (!(category_settings instanceof Object))
        {
            saved_settings[category] = {};
        }
        if (category_settings.constructor != Object)
        {
            saved_settings[category] = {};
        }
    }
    
    if (!Object.keys(saved_settings).includes("__default"))
    {
        saved_settings["__default"] = default_settings;
    }

    return saved_settings;
}

function loadSettingsCategory(wanted_category)
{
    const saved_settings = loadSettings();

    let loaded_category = {};
    if (Object.keys(saved_settings).includes(wanted_category))
        loaded_category = saved_settings[wanted_category];

    return loaded_category;
}

function alterLocationPopupBarVisibility(event, visibility)
{
    var popup_box = document.getElementById('r_location_popup_box');
    var blackout_box = document.getElementById('r_location_popup_blackout');
    if (document.getElementById('location_bar_inner_container') != event.target && event.target != undefined) //I... think what is happening here is that we're receiving mouseleave events for the last innerHTML, and that causes a re-pop-up, so only listen to events from current inner containers
        return;
    
    if (popup_box == undefined)
        return;
    
    if (visibility)
    {
        blackout_box.style.visibility = "visible";
        blackout_box.style.transition = "opacity 1.0s";
        
        popup_box.style.opacity = 1.0;
        blackout_box.style.opacity = 1.0;
        
        //scroll up from proper position:
        if (!(popup_box.style.bottom === "4.59em"))
        {
            var saved_transition = popup_box.style.transition;
            popup_box.style.transition = "";
            popup_box.style.bottom = "-" + popup_box.clientHeight + "px";
            popup_box.offsetHeight; //force movement
            popup_box.style.transition = saved_transition;
            
            popup_box.style.bottom = "4.59em"; //supposed to be 4.6em, but temporarily renders one pixel off in chromium otherwise
        }
    }
    else
    {
        if (!browserProbablySupportsPointerEvents()) //disable animation, but allow clicks
            blackout_box.style.visibility = "hidden";
        blackout_box.style.transition = "opacity 0.25s";
        blackout_box.style.opacity = 0.0;
        popup_box.style.bottom = "-" + popup_box.clientHeight + "px";
    }
}

function setMatrixStatus(status)
{
	var request = new XMLHttpRequest();
	var form_data = "set user preferences=true&matrix disabled=" + status;
	
	request.open("POST", __guide_ash_url, false);
	request.send(form_data);
    
    document.location.reload(true);
}
