class ScenesHandler { // ONLY THE DM USES THIS OBJECT

	reload(callback = null) { //This is still used for grid wizard loading since we load so many times.
		this.switch_scene(this.current_scene_id, null);
	}

	async switch_scene(sceneid, callback = null) { //This is still used for grid wizard loading since we load so many times. -- THIS FUNCTION SHOULD DIE AFTER EVERYTHING IS IN THE CLOUD
		$('canvas#aligner2, canvas#aligner1').remove();
		let grid_5 = function() {
			$("#scene_selector_toggle").show();
			$("#tokens").show();
			
			window.CURRENT_SCENE_DATA = {
				...window.CURRENT_SCENE_DATA,
				upsq: "ft",
				fpsq: "5",
				grid_subdivided: "0"
			}
			consider_upscaling(window.CURRENT_SCENE_DATA);
			window.ScenesHandler.persist_current_scene();
			$("#wizard_popup").empty().append("You're good to go!!");
			$("#exitWizard").remove();
			$("#wizard_popup").delay(2000).animate({ opacity: 0 }, 4000, function() {
				$("#wizard_popup").remove();
			});
			$("#light_container").css('visibility', 'visible');
			$("#darkness_layer").css('visibility', 'visible');
		};


		let align_grid = function(square = false, just_rescaling = true, copiedSceneData) {


		
	    
			$("#tokens").hide();

			window.CURRENT_SCENE_DATA.grid_subdivided = "0";
			$("#VTT").css("--scene-scale", window.CURRENT_SCENE_DATA.scale_factor)
			let aligner1 = $("<canvas id='aligner1'/>");
			aligner1.width(59);
			aligner1.height(59);
			aligner1.css("position", "absolute");
			aligner1.css("border-radius", "50%");
			aligner1.css("top", `${Math.floor($("#scene_map").height() / 60) / 2 * 60 - 29}px`);
			aligner1.css("left", `${Math.floor($("#scene_map").width() / 60) / 2 * 60 - 29}px`);
			aligner1.css("z-index", 40);

			let drawX = function(canvas) {

				let ctx = canvas.getContext("2d");

				ctx.strokeStyle = "red";
				ctx.lineWidth = 1;
				ctx.setLineDash([10, 10, 19, 10, 10]);
				ctx.beginPath();
				ctx.moveTo(29, 0);
				ctx.lineTo(29, 58);
				ctx.moveTo(0, 29);
				ctx.lineTo(58, 29);
				ctx.stroke();
			};

			let canvas1 = aligner1.get(0);

			let ctx = canvas1.getContext("2d");
			canvas1.width = 59;
			canvas1.height = 59;
			ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
			ctx.fillRect(0, 0, canvas1.width, canvas1.height);
			if (square)
				ctx.fillStyle = "rgba(255,0,0,0.5)";
			else
				ctx.fillStyle = "rgba(0,255,0,0.5)";
			ctx.fillRect(0, 0, 59, 29);
			ctx.fillRect(0, 29, 29, 29);
			drawX(canvas1);

			let aligner2 = $("<canvas id='aligner2'/>");
			aligner2.width(59);
			aligner2.height(59);
			aligner2.css("position", "absolute");
			aligner2.css("border-radius", "50%");
			
			aligner2.css("top", `${parseFloat(aligner1.css('top')) + 180}px`);
			aligner2.css("left", `${parseFloat(aligner1.css('left')) + 180}px`);
			
			
			aligner2.css("z-index", 40);

			let canvas2 = aligner2.get(0);
			canvas2.width = 59;
			canvas2.height = 59;
			ctx = canvas2.getContext("2d");
			ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
			ctx.fillRect(0, 0, canvas2.width, canvas2.height);
			ctx.fillStyle = "rgba(0,255,0,0.5)";
			ctx.fillRect(0, 29, 59, 29);
			ctx.fillRect(29, 0, 29, 29);
			drawX(canvas2);


			let pageX = Math.round(parseInt(aligner1.css('left')) * window.ZOOM - ($(window).width() / 2));
			let pageY = Math.round(parseInt(aligner1.css('top')) * window.ZOOM - ($(window).height() / 2));
			$("html,body").animate({
				scrollTop: pageY + window.VTTMargin,
				scrollLeft: pageX + window.VTTMargin
			}, 500);


			let regrid = function(e) {

				window.CURRENT_SCENE_DATA.grid_subdivided = '0';

				let al1 = {
					x: parseInt(aligner1.css("left")) + 29,
					y: parseInt(aligner1.css("top")) + 29,
				};

				let al2 = {
					x: parseInt(aligner2.css("left")) + 29,
					y: parseInt(aligner2.css("top")) + 29,
				};

				let adjustmentSliders = {
					x: ($('#horizontalMinorAdjustmentInput').val()-50)/10,
					y: ($('#verticalMinorAdjustmentInput').val()-50)/10,
				}

				let ppsx;
				let ppsy;
				let offsetx;
				let offsety;
				let numberOfGrid = ($("#gridType input:checked").val() != 1) ? 2 : 3
				if (just_rescaling) {
					ppsx = (al2.x - al1.x);
					ppsy = (al2.y - al1.y);
					offsetx = 0;
					offsety = 0;
				}
				else {
					ppsx = (al2.x - al1.x) / numberOfGrid;
					ppsy = (al2.y - al1.y) / numberOfGrid;
					if(window.CURRENT_SCENE_DATA.gridType == 1){
						ppsx += adjustmentSliders.x;
						ppsy += adjustmentSliders.y;
					}
					
					
					if($('#gridType input:checked').val() == 3){
						ppsy = ppsx;
					}
					else if($('#gridType input:checked').val() == 2){
						ppsx = ppsy;
					}

					offsetx = al1.x % ppsx;
					offsety = al1.y % ppsy;
				}

				const a = 2 * Math.PI / 6;
				let difference;
				if($('#gridType input:checked').val() == 3){			
						offsety = al1.y % (ppsx/1.5 * Math.sin(a)*2);
						 
						offsetx = al1.x % ppsx/1.5 * (1 + Math.cos(a))
						difference = (Math.ceil((al1.x / ppsx/1.5 * (1 + Math.cos(a))))+1)%2
						offsety += ppsx/1.5 * Math.sin(a)*difference
				}
				if($('#gridType input:checked').val() == 2){				
						offsetx = (al1.x % (ppsx/1.5 * Math.sin(a)*2));							
						offsety = al1.y % ppsx/1.5 * (1 + Math.cos(a))
						difference = (Math.ceil((al1.y / ppsx/1.5 * (1 + Math.cos(a))))+1)%2
						offsetx += ppsx/1.5 * Math.sin(a)*difference
				}
				
				console.log("ppsx " + ppsx + "ppsy " + ppsy + "offsetx " + offsetx + "offsety " + offsety)
				window.CURRENT_SCENE_DATA.hpps = Math.abs(ppsx);
				window.CURRENT_SCENE_DATA.vpps = Math.abs(ppsy);
				window.CURRENT_SCENE_DATA.offsetx = Math.abs(offsetx);
				window.CURRENT_SCENE_DATA.offsety = Math.abs(offsety);
				
				if($("#edit_dialog").length != 0){
					$('#squaresWide').val(`${$('#scene_map').width()/window.CURRENT_SCENE_DATA.hpps}`)
					$('#squaresTall').val(`${$('#scene_map').height()/window.CURRENT_SCENE_DATA.vpps}`)					
					$('input[name="offsetx"]').val(`${window.CURRENT_SCENE_DATA.offsetx}`)
					$('input[name="offsety"]').val(`${window.CURRENT_SCENE_DATA.offsety}`)
					$('input[name="offsetx"]').attr('data-prev-value', window.CURRENT_SCENE_DATA.offsetx);
					$('input[name="offsety"]').attr('data-prev-value', window.CURRENT_SCENE_DATA.offsety);
				}
				if(window.CURRENT_SCENE_DATA.gridType && window.CURRENT_SCENE_DATA.gridType != 1){
					window.CURRENT_SCENE_DATA.scaleAdjustment = {
						x: 1 + (adjustmentSliders.x / 50),
						y: 1 + (adjustmentSliders.y / 50)
					}
				}
				else {
					delete window.CURRENT_SCENE_DATA.scaleAdjustment;
				}
				let width
				if (window.ScenesHandler.scene.upscaled == "1")
					width = 2;
				else
					width = 1;
				const dash = [30, 5];
				const color = "rgba(255, 0, 0, 1)";
				// nulls will take the window.current_scene_data from above
				window.CURRENT_SCENE_DATA.gridType = $('#gridType input:checked').val();
				window.CURRENT_SCENE_DATA.gridOver = 1;
				redraw_grid(null,null,null,null,color,width,null,dash)
			};

			let click2 = {
				x: 0,
				y: 0
			};
			aligner2.draggable({
				stop: regrid,
				start: function(event) {
					click2.x = event.clientX;
					click2.y = event.clientY;
					$("#aligner2").attr('original-top', parseInt($("#aligner2").css("top")));
					$("#aligner2").attr('original-left', parseInt($("#aligner2").css("left")));
				},
				drag: function(event, ui) {
					clear_grid()
					
					let zoom = window.ZOOM;

					let original = ui.originalPosition;
					ui.position = {
						left: Math.round((event.clientX - click2.x + original.left) / zoom),
						top: Math.round((event.clientY - click2.y + original.top) / zoom)
					};

					if ($('#gridType input:checked').val() != 1) {
						
							let left = parseInt($("#aligner1")[0].style.left) + parseInt(event.target.style.top) - parseInt($("#aligner1").css('top'))
							left = (parseInt(event.target.style.top) - parseInt($("#aligner1").css('top'))) < 25 ? parseInt($("#aligner1").css('left')) + 25 : left
							let top = (parseInt(event.target.style.top) - parseInt($("#aligner1").css('top'))) < 25 ? parseInt($("#aligner1").css('top')) + 25 : Math.round((event.clientY - click2.y + original.top) / zoom);
					
							ui.position = {
								left: left,
								top: top
							};
						draw_wizarding_box()
					}
					else if($('#linkAligners input').val() == 1){
							let left;
							let top;
							if(ui.position.top - parseInt($("#aligner1").css('top')) > ui.position.left - parseInt($("#aligner1").css('left'))){
								left = parseInt($("#aligner1")[0].style.left) + parseInt(event.target.style.top) - parseInt($("#aligner1").css('top'))
								left = (parseInt(event.target.style.top) - parseInt($("#aligner1").css('top'))) < 25 ? parseInt($("#aligner1").css('left')) + 25 : left
								top = (parseInt(event.target.style.top) - parseInt($("#aligner1").css('top'))) < 25 ? parseInt($("#aligner1").css('top')) + 25 : Math.round((event.clientY - click2.y + original.top) / zoom);
							}
							else {
								top = parseInt($("#aligner1")[0].style.top) + parseInt(event.target.style.left) - parseInt($("#aligner1").css('left'))
								top = (parseInt(event.target.style.left) - parseInt($("#aligner1").css('left'))) < 25 ? parseInt($("#aligner1").css('top')) + 25 : top
								left = (parseInt(event.target.style.left) - parseInt($("#aligner1").css('left'))) < 25 ? parseInt($("#aligner1").css('left')) + 25 : Math.round((event.clientX - click2.x + original.left) / zoom);						
							}


							ui.position = {
								left: left,
								top: top
							};
						draw_wizarding_box()
					}
					else {			
						draw_wizarding_box()
					}
					

				}
			});

			let click1 = {
				x: 0,
				y: 0
			};

			aligner1.draggable({
				stop: regrid,
				start: function(event) {
					click1.x = event.clientX;
					click1.y = event.clientY;
					$("#aligner1").attr('original-top', parseInt($(event.target).css("top")));
					$("#aligner1").attr('original-left', parseInt($(event.target).css("left")));
					$("#aligner2").attr('original-top', parseInt($("#aligner2").css("top")));
					$("#aligner2").attr('original-left', parseInt($("#aligner2").css("left")));
				},
				drag: function(event, ui) {
					clear_grid()

					let zoom = window.ZOOM;

					let original = ui.originalPosition;
					ui.position = {
						left: Math.round((event.clientX - click1.x + original.left) / zoom),
						top: Math.round((event.clientY - click1.y + original.top) / zoom)
					};

					
					if ($('#gridType input:checked').val() != 1 || $('#linkAligners input').val() == 1) { // restrict on 45
						let originalDiff = {
							x:parseInt($("#aligner2").attr('original-left')) - parseInt($("#aligner1").attr('original-left')),
							y:parseInt($("#aligner2").attr('original-top')) - parseInt($("#aligner1").attr('original-top'))
						}
						$("#aligner2").css('left', `${parseInt($("#aligner1").css('left')) + originalDiff.x}px`);
						$("#aligner2").css('top', `${parseInt($("#aligner1").css('top')) + originalDiff.y}px`);
						draw_wizarding_box()

					}
					else {
						draw_wizarding_box()
					}
				}
			});


			$("#VTT").append(aligner1);
			$("#VTT").append(aligner2);

			open_grid_wizard_controls(sceneid, aligner1, aligner2, regrid, copiedSceneData);

			$("#light_container, #darkness_layer, #raycastingCanvas").css('visibility', 'hidden');
			
			regrid();


		}; // END OF ALIGN GRID WIZARD!

		this.current_scene_id = sceneid;
		let self = this;
		let scene = this.scenes[sceneid];
		this.scene = scene;
		if(!scene.id){
			scene.id=uuid();
		}

		if (typeof scene.player_map_is_video === 'undefined') {
			scene.player_map_is_video = "0";
		}
		if (typeof scene.dm_map_is_video === 'undefined') {
			scene.dm_map_is_video = "0";
		}

		window.CURRENT_SCENE_DATA = scene;

		$(".VTTToken, .door-button").each(function() {
			$("#aura_" + $(this).attr("data-id").replaceAll("/", "")).remove();
			$("#light_" + $(this).attr("data-id").replaceAll("/", "")).remove();
			$(`.aura-element-container-clip[id='${$(this).attr("data-id")}']`).remove();
		});
		$(".VTTToken").remove();
		$('#raycastingCanvas').css('opacity', '0');
		$('#scene_map_container').css('background', '#fff');
		for (let i in window.TOKEN_OBJECTS) {
			delete window.TOKEN_OBJECTS[i];
			delete window.ON_SCREEN_TOKENS[i]
		}
		window.lineOfSightPolygons = {};

		if (scene.grid_subdivided == "1")
			scene.grid = "1";


		if (!scene.hpps) { // THIS IS OLD DATA FROM < 0.0.20!!! WE NEED TO COMPLETE WHAT IS MISSING and TRY TO FIX IT :()
			console.log("converting pre 0.0.20 scene.... Good lock to you, oh brave adventurer")
			scene.hpps = Math.round((6000.0 / scene.scale));
			scene.vpps = scene.hpps;
			scene.offsetx = 0;
			scene.offsety = 0;
			scene.grid = 0;
			scene.snap = 0;
			scene.fpsq = 5;
			scene.upsq = 'ft'

			for (let id in scene.tokens) { // RESCALE ALL THE TOKENS
				let tok_options = scene.tokens[id];
				tok_options.size = (tok_options.size / 60) * scene.hpps;
				tok_options.top = Math.round(parseInt(tok_options.top) / (scene.scale / 100.0)) + "px";
				tok_options.left = Math.round(parseInt(tok_options.left) / (scene.scale / 100.0)) + "px";
			}

			// RESCALE THE REVEALS
			for (let i = 0; i < scene.reveals.length; i++) {
				scene.reveals[i][0] = Math.round((scene.reveals[i][0] / 60.0) * scene.hpps);
				scene.reveals[i][1] = Math.round((scene.reveals[i][1] / 60.0) * scene.hpps);
				scene.reveals[i][2] = Math.round((scene.reveals[i][2] / 60.0) * scene.hpps);
				scene.reveals[i][3] = Math.round((scene.reveals[i][3] / 60.0) * scene.hpps);
			}


		}

		scene.vpps = parseFloat(scene.vpps);
		scene.hpps = parseFloat(scene.hpps);
		scene.offsetx = parseFloat(scene.offsetx);
		scene.offsety = parseFloat(scene.offsety);

		let copiedSceneData = $.extend(true, {}, window.CURRENT_SCENE_DATA);
		

		scene.scale_factor = 1;
		scene.grid_subdivided = '0';

		// CALCOLI DI SCALA non dovrebbero servire piu''
		scene['scale'] = (60.0 / parseInt(scene['hpps'])) * 100; // for backward compatibility, this will be horizonat scale
		scene['scaleX'] = (60.0 / parseInt(scene['hpps'])); // for backward compatibility, this will be horizonat scale
		scene['scaleY'] = (60.0 / parseInt(scene['vpps'])); // for backward compatibility, this will be horizonat sca

		$("#tokens").show();
		$(".alphaNumGrid").remove();

		window.FOG_OF_WAR = true;
		window.REVEALED = [[0, 0, 0, 0, 2, 0]].concat(self.scene.reveals);


	
		window.DRAWINGS = [];
		
		
		let map_url = "";
		let map_is_video = false;
		if ((scene.dm_map != "") && (scene.dm_map_usable == "1") && (window.DM)) {
			map_url = scene.dm_map;
			map_is_video = (scene.dm_map_is_video === "1");
		}
		else {
			map_url = scene.player_map;
			map_is_video = (scene.player_map_is_video === "1");
		}

		if(scene.UVTTFile == 1){
			map_url = await get_map_from_uvtt_file(scene.player_map);
		}

		//This is still used for grid wizard loading since we load so many times -- it is not used for other scene loading though. You can find that in message broker handleScene
		load_scenemap(map_url, map_is_video, window.CURRENT_SCENE_DATA.width, window.CURRENT_SCENE_DATA.height, window.CURRENT_SCENE_DATA.UVTTFile, async function() {
			$("#scene_map").off("load");
			delete window.LOADING;
			const continueLoading = await reset_canvas();
			if(!continueLoading) return;
			await set_default_vttwrapper_size()
			align_grid(false, false, copiedSceneData);
			window.WeatherOverlay.stop();
		});


	}

	display_scene_properties(scene_id) {
		console.log('inizio....');
		let self = this;
		let scene = this.scenes[scene_id];
		let container = $("#scene_properties");
	}

	build_adventures(callback) {
		let self = this;

		if(Object.keys(self.sources).length!=0){
			callback();
			return;
		}
		
		let f = $("<iframe src='/en/library'></iframe");
		f.hide();
		$("#site").append(f);
		
		
		let scraped_sources={};

		f.on("load", function(event) {
			console.log('iframe pronto..');
			let iframe = $(event.target);
			iframe.contents().find("[class*='SourceCard_sourceTitle']").each(function(idx) {
				let ddbtype=$(this).closest(".sources-listing").attr('id'); // get Sourcebooks of Adventures
				let title = $(this).html();
				let url = $(this).attr("href");
				let keyword = url.replaceAll(/https:\/\/www\.dndbeyond\.com|^\/?sources\/|/gi, '');

				if (keyword in self.sources){ // OBJECT ALREADY EXISTS... evito di riscrivere per non perdere i dati
					scraped_sources[keyword]=self.sources[keyword];
					return;
				}
				scraped_sources[keyword] = {
					type: 'dnb',
					ddbtype:ddbtype,
					title: title,
					url: url,
					chapters: {},
				};
			});
			iframe.remove();

			// SORT
			self.sources = Object.keys(scraped_sources)
				.sort(
					function(a, b) {
						if (scraped_sources[a].ddbtype == scraped_sources[b].ddbtype) {
							return ((scraped_sources[a].title == scraped_sources[b].title) ? 0 : ((scraped_sources[a].title > scraped_sources[b].title) ? 1 : -1));
						}
						else {
							return (scraped_sources[a].ddbtype == "Adventures") ? 1 : -1;
						}
					}
				)
				.reduce((acc, key) => ({
					...acc, [key]: scraped_sources[key]
				}), {})
			
			
			callback();
		});
	}

	build_chapters(keyword, callback) {
		let self = this;
		console.log('scansiono ' + keyword);
		//let target_list = $("#" + $(event.target).attr('data-target'));
		//let adventure_url = 'https://www.dndbeyond.com/sources/' + keyword;
		let adventure_url="https://www.dndbeyond.com/"+self.sources[keyword].url;

		if (self.sources[keyword].type != 'dnb') {
			callback();
			return;
		}

		// EVITO DI RISCANSIONARE UN OGGETTO CHE HO GIA'
		if (Object.keys(self.sources[keyword].chapters).length > 0) {
			console.log('no.... non scansiono')
			callback();
			return;
		}

		//if($(event.target).attr('data-status')==0){
		let f = $("<iframe name='scraper' src='" + adventure_url + "'></iframe>");
		f.hide();
		$("#site").append(f);


		f.on("load", function(event) {
			let iframe = $(event.target);
			console.log('caricato ' + window.frames['scraper'].location.href);

			if (window.frames['scraper'].location.href != adventure_url) {
				console.log('rilevato cambio url');
				let title = "Single Chapter";
				let url = window.frames['scraper'].location.href;
				let ch_keyword = url.replace('https://www.dndbeyond.com', '').replace('/sources/' + keyword + "/", '').replace('/sources/' + keyword.replace('dnd/', '') + "/", '')
				self.sources[keyword].chapters[ch_keyword] = {
					type: 'dnb',
					title: title,
					url: url,
					scenes: [],
				}
			}
			else {
				//chapter, subchapter (eg icewind), chapter, handouts and maps (eg. Curse of Strahd)
				iframe.contents().find("h3 > a, h3 ~ ul strong a, h4 > a, h3.adventure-chapter-header:contains('Appendices') ~ ul a, h3 ~ ul>li a:not([href*='#'])").each(function(idx) {
					let title = $(this).text();
					let url = $(this).attr('href');
					let ch_keyword = url.replace('https://www.dndbeyond.com', '').replace('/sources/' + keyword + "/", '').replace('/sources/' + keyword.replace('dnd/', '') + "/", '')
					self.sources[keyword].chapters[ch_keyword] = {
						type: 'dnb',
						title: title,
						url: url,
						scenes: [],
					};
				});
				//map sections that are just links to maps not always found in other chapters (eg wildemount/eberron)
				iframe.contents().find("h3.adventure-chapter-header:contains('Map') ~ ul a").each(function(idx) {
					if(!(/\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test($(this).attr('href'))))
						return;
					let title = $(this).text();
					let url = $(this).attr('href');
					let ch_keyword = url.replace('https://www.dndbeyond.com', '').replace('/sources/' + keyword + "/", '').replace('/sources/' + keyword.replace('dnd/', '') + "/", '')
					self.sources[keyword].chapters[ch_keyword] = {
						type: 'dnb',
						title: title,
						url: url,
						scenes: [],
					};
				});
			}
			iframe.remove();
			callback();
		});
	}

	build_scenes(source_keyword, chapter_keyword, callback) {
		let self = this;

		//let chapter_url='https://www.dndbeyond.com/sources/'+source_keyword+'/'+chapter_keyword;
		let chapter_url = self.sources[source_keyword].chapters[chapter_keyword].url;
		console.log("checking for scenes in " + chapter_url);

		if (self.sources[source_keyword].chapters[chapter_keyword].type != 'dnb') {
			callback();
			return;
		}

		if (Object.keys(self.sources[source_keyword].chapters[chapter_keyword].scenes).length > 0) { // EVITO DI SCANSIONARE DI NUOVO OGGETTI CHE HO GIA
			callback();
			return;
		}	
		if(/\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(chapter_url)){
			//'Maps' chapter maps at the end of books - individual images
			let dm_map = '';
			let player_map = chapter_url;
			let header = self.sources[source_keyword].chapters[chapter_keyword].title;
			let thumb = chapter_url;
			let id = self.sources[source_keyword].chapters[chapter_keyword].title;
			let title = self.sources[source_keyword].chapters[chapter_keyword].title;

			self.sources[source_keyword].chapters[chapter_keyword].scenes.push({
				id: id,
				uuid: source_keyword + "/" + chapter_keyword + "/" + id,
				title: title,
				dm_map: dm_map,
				player_map: player_map,
				player_map_is_video: "0",
				dm_map_is_video: "0",
				scale: "100",
				dm_map_usable: "0",
				thumb: thumb,
				tokens: {},
			});
			callback();
			return;
		}

		let f = $("<iframe src='" + chapter_url + "'></iframe>");

		f.hide();
		$("#site").append(f);


		f.on("load", function(event) {
			let iframe = $(event.target);
			if(iframe.contents().length == 0){
				let notOwned = true;
				iframe.remove();
				console.log('Book failed to load - probably do not own it');
				callback(notOwned);
				return;
			}

			const mapButtonDetails = {};
			const mapButtons = iframe.contents().find(".map-button, .map-button-circle");
			const frameBody = iframe.contents().find('body');
			mapButtons.each(function(){
				const id = this.id;
				const href = this.href;
				const mapImg = $(this).parent().find('img')
				const mapImgSrc = mapImg.attr('src');
				const naturalWidth = mapImg[0]?.naturalWidth;
				const naturalHeight = mapImg[0]?.naturalHeight;
				const left = parseFloat($(this).css('left'))/100;
				const top = parseFloat($(this).css('top'))/100;
				const text = $(this).text();
			    const body = frameBody.clone();
				const bodyClass = body.attr('class');
				const subClasses = ['p-article-a', 'p-article-content'] 

				const section = body.find(href.match(/#.*$/gi)?.[0]);
				if(section.length == 0)
					return // linking to another scene so return, don't add note or token
				const sectionElementType = section[0].tagName;

				const sectionHtml = $('<div>').append(section.nextUntil(`${sectionElementType}`).addBack());

				if(mapButtonDetails[mapImgSrc] == undefined)
					mapButtonDetails[mapImgSrc] = {};
				mapButtonDetails[mapImgSrc][id] ={
					'left': left*naturalWidth,
					'top': top*naturalHeight,
					'text': text,
					'href': href,
					'sectionHtml': sectionHtml.html()
				}
			})	

			iframe.contents().find("figure").each(function(idx) { // FIGURE + FIGCAPTION. 
				let id = $(this).attr('id');
				if (typeof id == typeof undefined)
					return;
				let img1 = $(this).find(".compendium-image-center, .compendium-image-left, .compendium-image-right, .compendium-center-banner-img").attr("href") || $(this).children('img').attr('src') ||$(this).find('.map-nav-container').children('img').attr('src');

				let links = $(this).find("figcaption a");
				let player_map = '';
				let dm_map = '';
				let figure_caption = $(this).find('figcaption');
				let title = figure_caption.clone()    //clone the element
					.children() //select all the children
					.remove()   //remove all the children
					.end()  //again go back to selected element
					.text();

				let thumb = $(this).find("img").attr('src');
				const tokens = {};
				const notes = {};
				dm_map = img1;
				if (links.length > 0) {
					if(links.filter('[data-title*="Tokens"]').length>0){
						dm_map = links.filter('[data-title*="Tokens"], [title*="Tokens"]').attr('href');
						player_map = links.filter('[data-title*="Player"], [title*="Player"]').attr('href');
					}
					else{
						player_map = links.attr('href');
					}
					
				}
				else {
					player_map = img1;
				}

				const currentMapNotes = mapButtonDetails[player_map] != undefined ? mapButtonDetails[player_map] :  mapButtonDetails[dm_map] != undefined ? mapButtonDetails[dm_map] : null;
				if(currentMapNotes != null){
					for(let i in currentMapNotes){
						const currButton = currentMapNotes[i]


						const newTokenId = uuid();
						const options = {
							...default_options(),
							...window.TOKEN_SETTINGS,
							id: newTokenId,
							name: currButton.text,
							left: `${currButton.left}px`,
							top: `${currButton.top}px`,
							imgsrc: `https://abovevtt-assets.s3.eu-central-1.amazonaws.com/numbers/${parseInt(currButton.text.replaceAll(/\D/gi, ''))}.png`,
							hidden: true,
							locked: true,
							disableborder: true,
							revealInFog: true

						}
						const newToken = new Token(options);
						tokens[newTokenId] = newToken.options;

						notes[newTokenId] = {
							plain: '',
							title: currButton.text,
							statBlock: false,
							text: currButton.sectionHtml,
							player: false
						}
					}
				}	
				if (!self.sources[source_keyword].chapters[chapter_keyword].scenes.some(d => d.uuid == `${source_keyword}/${chapter_keyword}/${id}`) )
					self.sources[source_keyword].chapters[chapter_keyword].scenes.push({
						id: id,
						uuid: source_keyword + "/" + chapter_keyword + "/" + id,
						title: title,
						dm_map: dm_map,
						player_map: player_map ? player_map : thumb,
						player_map_is_video: "0",
						dm_map_is_video: "0",
						thumb: thumb,
						scale: "100",
						dm_map_usable: dm_map ? "1" : '0',
						tokens: tokens,
						notes: notes
					});
			});

			// COMPENDIUM IMAGES
			let compendiumWithSubtitle = iframe.contents().find(".compendium-image-with-subtitle-center,.compendium-image-with-subtitle-right,.compendium-image-with-subtitle-left");
			let compendiumWithoutSubtitle = iframe.contents().find(".compendium-image-center, .compendium-image-left, .compendium-image-right");

			if (compendiumWithSubtitle.length > 0) {
				compendiumWithSubtitle.each(function(idx) {
					if ($(this).parent().is('figure') || $(this).is('figure'))
						return;
					let id = $(this).attr('id');
					if (typeof id == typeof undefined) {
						id = $(this).attr('data-content-chunk-id');
					}
					let thumb = $(this).find("img").attr('src');
					let img1 = $(this).find(".compendium-image-center,.compendium-image-right,.compendium-image-left").attr("href");
					let title = $(this).find(".compendium-image-subtitle").text();
					let player_map;
					let dm_map;

					dm_map = img1;
					if ($(this).next().hasClass("compendium-image-view-player")) {
						player_map = $(this).next().find(".compendium-image-center").attr("href");
					}
					else if ($(this).find(".compendium-image-view-player a").length > 0) {
						player_map = $(this).find(".compendium-image-view-player a").attr("href");
					}
					else {
						player_map = img1;
					}

					self.sources[source_keyword].chapters[chapter_keyword].scenes.push({
						id: id,
						uuid: source_keyword + "/" + chapter_keyword + "/" + id,
						title: title,
						dm_map: dm_map,
						player_map: player_map ? player_map : thumb,
						player_map_is_video: "0",
						dm_map_is_video: "0",
						thumb: thumb,
						scale: "100",
						dm_map_usable: dm_map ? "1" : '0',
						tokens: {},
					});
				});
			} else if (compendiumWithoutSubtitle.length > 0) {
				compendiumWithoutSubtitle.each(function(idx) {
					// import it only if there's a player version

					if ($(this).parent().is('figure') || $(this).is('figure'))
						return;
					let playerMapContainer;
					if ($(this).parent().next().is(".compendium-image-view-player")) {
						playerMapContainer = $(this).parent().next().find(".compendium-image-center");
					} else if ($(this).parent().next().find(".compendium-image-center a").length > 0) {
						playerMapContainer = $(this).parent().next().find(".compendium-image-center a");
					} else if($(this).parent().not('.compendium-image-view-player').length > 0){
						playerMapContainer = $(this);
					}
					if (playerMapContainer === undefined || playerMapContainer.length === 0) {
						return;
					}


					let dm_map = $(this).attr('href');
					let player_map = playerMapContainer.attr("href");
					let header = $(this).parent().prevAll("[id]:first");
					let thumb = $(this).find("img").attr('src');
					let id = header.attr("id");
					let title = header.text();

					self.sources[source_keyword].chapters[chapter_keyword].scenes.push({
						id: id,
						uuid: source_keyword + "/" + chapter_keyword + "/" + id,
						title: title,
						dm_map: dm_map,
						player_map: player_map ? player_map : thumb,
						player_map_is_video: "0",
						dm_map_is_video: "0",
						thumb: thumb,
						scale: "100",
						dm_map_usable: dm_map ? "1" : '0',
						tokens: {},
					});

				});
			}

			iframe.remove();
			console.log('INVOKO CALLBACK');
			callback();
		});
	}

	create_update_token(options, noScale = false ) {
		console.log("create_update_token");
		let self = this;
		let id = options.id;
		if(!noScale)
			options.scaleCreated = window.CURRENT_SCENE_DATA.scale_factor;
		this.scene.tokens[id]=options;

		if (!(id in window.TOKEN_OBJECTS)) {
			window.TOKEN_OBJECTS[id] = new Token(options);
		}

		if(options.repositionAoe != undefined){
			window.TOKEN_OBJECTS[id].place(0);
			let origin, dx, dy;		
			origin = getOrigin(window.TOKEN_OBJECTS[id]);
			dx = origin.x - options.repositionAoe.x;
			dy = origin.y - options.repositionAoe.y;				
			options.left = `${parseFloat(options.left) - dx}px`;
			options.top = `${parseFloat(options.top) - dy}px`;
			delete options.repositionAoe;
		}
		
		window.TOKEN_OBJECTS[id].place(0);
		window.TOKEN_OBJECTS[id].sync();

	}


	async persist_scene(scene_index,isnew=false){ // CLOUD ONLY FUNCTION
		let sceneData=Object.assign({},this.scenes[scene_index]);
		if(!sceneData.scale_check){

			const scale_factor = (!isNaN(parseInt(sceneData.scale_factor))) ? parseInt(sceneData.scale_factor) : 1;
			sceneData = {
				...sceneData,
				hpps: sceneData.hpps / scale_factor,
				vpps: sceneData.vpps / scale_factor,
				offsetx: sceneData.offsetx / scale_factor,
				offsety: sceneData.offsety / scale_factor
			}
		}
		sceneData ={
			...sceneData,
			scale_check: true,
			reveals: [],
			drawings:[],
			tokens: {}
		}

		
		if(isnew)
			sceneData.isnewscene=true;
		sceneData = await normalize_scene_urls([sceneData]);
		sceneData = sceneData[0];
		this.scenes[scene_index] = sceneData;

		window.MB.sendMessage("custom/myVTT/update_scene",sceneData);

		if(window.DM && window.splitPlayerScenes?.players != undefined){
		 	window.MB.sendMessage("custom/myVTT/switch_scene", { sceneId: window.splitPlayerScenes});
		}     
	}

	async persist_current_scene(dontswitch=false){
		let scene_index = window.ScenesHandler.scenes.findIndex(s => s.id === window.CURRENT_SCENE_DATA.id);
		window.ScenesHandler.scenes[scene_index] = window.CURRENT_SCENE_DATA;
		window.ScenesHandler.scene = window.CURRENT_SCENE_DATA;
		let sceneData=Object.assign({},this.scene);

		sceneData = {
			...sceneData,
			scale_check: true,
			reveals: [],
			drawings:[],
			tokens: {}
		}

		sceneData.isnewscene=false;
		sceneData = await normalize_scene_urls([sceneData]);
		sceneData = sceneData[0];
		window.MB.sendMessage("custom/myVTT/update_scene",sceneData,dontswitch);
		const currentPlayerScenes = Object.values(window.splitPlayerScenes);
		if(window.DM && dontswitch == false && currentPlayerScenes.includes(sceneData.id)){
			setTimeout(function(){
				window.MB.sendMessage("custom/myVTT/switch_scene", { sceneId: window.splitPlayerScenes});
			}, 100)
		}
		did_update_scenes();
		
	}

	delete_scene(sceneId, reloadUI = true) { // not the index, but the actual id
		window.MB.sendMessage("custom/myVTT/delete_scene",{ id: sceneId });
		let sceneIndex = window.ScenesHandler.scenes.findIndex(s => s.id === sceneId);
		window.ScenesHandler.scenes.splice(sceneIndex, 1);
		remove_zoom_from_storage(sceneId);
		if (window.JOURNAL.notes[sceneId] != undefined){
			delete window.JOURNAL.notes[sceneId];
			window.JOURNAL.persist();
		}
		if (reloadUI) {
			did_update_scenes();
		}
		if(window.DM && window.splitPlayerScenes?.players != undefined){
		 	window.MB.sendMessage("custom/myVTT/switch_scene", { sceneId: window.splitPlayerScenes});
		}   
	}

	persist() {
		console.error("ScenesHandler.persist is no longer a function. Stop calling it!");
	}

	sync() {
		console.error("ScenesHandler.sync is no longer a function. Stop calling it!");
	}

	constructor() {
		this.sources = {};
		this.scenes = [];
		this.current_scene_id = null;
	}
}

function folder_path_of_scene(scene) {
	const parent = find_parent_of_scene(scene);
	if (parent) {
		const ancestors = find_ancestors_of_scene(parent);
		let ancestorPath = ancestors.reverse().map(s => s.title).join("/")
		if (!ancestorPath.startsWith(RootFolder.Scenes.path)) {
			ancestorPath = `${RootFolder.Scenes.path}/${ancestorPath}`;
		}
		return sanitize_folder_path(ancestorPath);
	} else {
		return RootFolder.Scenes.path;
	}
}
function find_parent_of_scene(scene) {
	if(scene.parentId == undefined)
		return false;
	return window.ScenesHandler.scenes.find(s => s.id === scene.parentId);
}
function find_ancestors_of_scene(scene, found = []) {
	found.push(scene);
	let parent = find_parent_of_scene(scene);
	if (parent) {
		return find_ancestors_of_scene(parent, found)
	} else {
		// TODO: anything special for parentId === RootFolder.Scene.id?
		return found;
	}
}

function find_descendants_of_scene_id(sceneId) {
	const scene = window.ScenesHandler.scenes.find(s => s.id === sceneId);
	return find_descendants_of_scene(scene);
}

function find_descendants_of_scene(scene, found = []) {
	if (!scene) {
		return found;
	}
	found.push(scene);
	window.ScenesHandler.scenes.forEach(s => {
		if (s.parentId === scene.id) {
			// this is a child, so process it
			found = find_descendants_of_scene(s, found);
		}
	});
	return found;
}

/**
 * Rotates all scene data (map dimensions, grid, tokens, walls/drawings, fog reveals) by 90, 180, or 270 degrees.
 * @param {Object} scene - The scene data object to modify in-place.
 * @param {number} angle - Rotation angle (default 90 for clockwise, -90 or 270 for counter-clockwise, 180).
 * @param {boolean} keepTokensUpright - Whether standard token portraits should remain upright (default true).
 */
function rotate_scene_data(scene, angle = 90, keepTokensUpright = true) {
	if (!scene) return;

	angle = ((angle % 360) + 360) % 360;
	if (angle === 0) return;

	const curRot = ((parseInt(scene.rotation) || 0) % 360 + 360) % 360;
	let rawW = 0, rawH = 0;

	const sceneMapEl = $("#scene_map");
	if (sceneMapEl.length) {
		const img = sceneMapEl[0];
		rawW = img.naturalWidth || img.videoWidth || 0;
		rawH = img.naturalHeight || img.videoHeight || 0;
	}
	if (!rawW || !rawH) {
		const conv = parseFloat(scene.conversion || window.CURRENT_SCENE_DATA?.conversion || 1) || 1;
		let w = parseFloat(scene.width) || parseFloat(window.CURRENT_SCENE_DATA?.width) || 0;
		let h = parseFloat(scene.height) || parseFloat(window.CURRENT_SCENE_DATA?.height) || 0;
		if (w && h) {
			if (conv < 1 && (w <= 2500 || h <= 2500)) {
				rawW = w / conv;
				rawH = h / conv;
			} else {
				rawW = w;
				rawH = h;
			}
		}
	}
	if (!rawW || !rawH) {
		rawW = sceneMapEl.width() || 2000;
		rawH = sceneMapEl.height() || 2000;
	}
	if (isNaN(rawW) || rawW <= 0) rawW = 2000;
	if (isNaN(rawH) || rawH <= 0) rawH = 2000;

	const conv = parseFloat(window.CURRENT_SCENE_DATA?.conversion || scene.conversion || 1) || 1;
	let totalScale = 1;
	if (window.CURRENT_SCENE_DATA?.scale_factor) {
		totalScale = parseFloat(window.CURRENT_SCENE_DATA.scale_factor) * conv;
	} else if (scene.scale_factor) {
		totalScale = parseFloat(scene.scale_factor);
	}
	if (isNaN(totalScale) || totalScale <= 0) totalScale = 1;

	let oldW = ((curRot === 90 || curRot === 270) ? rawH : rawW) * totalScale;
	let oldH = ((curRot === 90 || curRot === 270) ? rawW : rawH) * totalScale;

	if (isNaN(oldW) || oldW <= 0) oldW = 2000;
	if (isNaN(oldH) || oldH <= 0) oldH = 2000;

	console.log(`[AboveVTT Rotate] rotate_scene_data: angle=${angle}, curRot=${curRot}, rawW=${rawW}, rawH=${rawH}, totalScale=${totalScale}, oldW=${oldW}, oldH=${oldH}`);

	function transformPoint(x, y) {
		x = parseFloat(x) || 0;
		y = parseFloat(y) || 0;
		let nx = (angle === 90) ? (oldH - y) : (angle === 270) ? y : (angle === 180) ? (oldW - x) : x;
		let ny = (angle === 90) ? x : (angle === 270) ? (oldW - x) : (angle === 180) ? (oldH - y) : y;
		if (isNaN(nx)) nx = x;
		if (isNaN(ny)) ny = y;
		return { x: nx, y: ny };
	}

	function transformRect(x, y, w, h) {
		x = parseFloat(x) || 0;
		y = parseFloat(y) || 0;
		w = parseFloat(w) || 0;
		h = parseFloat(h) || 0;
		let rx = (angle === 90) ? (oldH - y - h) : (angle === 270) ? y : (angle === 180) ? (oldW - x - w) : x;
		let ry = (angle === 90) ? x : (angle === 270) ? (oldW - x - w) : (angle === 180) ? (oldH - y - h) : y;
		let rw = (angle === 90 || angle === 270) ? h : w;
		let rh = (angle === 90 || angle === 270) ? w : h;
		if (isNaN(rx)) rx = x;
		if (isNaN(ry)) ry = y;
		if (isNaN(rw)) rw = w;
		if (isNaN(rh)) rh = h;
		return { x: rx, y: ry, w: rw, h: rh };
	}

	// 1. Map Dimensions & Rotation
	scene.rotation = ((parseInt(scene.rotation) || 0) + angle) % 360;
	if (angle === 90 || angle === 270) {
		scene.width = oldH / totalScale;
		scene.height = oldW / totalScale;
	}

	// 2. Grid Transformation
	if (angle === 90 || angle === 270) {
		const tempHpps = parseFloat(scene.hpps) || 60;
		scene.hpps = parseFloat(scene.vpps) || 60;
		scene.vpps = tempHpps;

		const gridDimW = (curRot === 90 || curRot === 270) ? rawH : rawW;
		const gridDimH = (curRot === 90 || curRot === 270) ? rawW : rawH;

		if (angle === 90) {
			scene.offsetx = ((gridDimH - (parseFloat(scene.offsety) || 0) - scene.vpps) % scene.hpps + scene.hpps) % scene.hpps;
			scene.offsety = (((parseFloat(scene.offsetx) || 0) % scene.vpps) + scene.vpps) % scene.vpps;
		} else {
			scene.offsetx = (((parseFloat(scene.offsety) || 0) % scene.hpps) + scene.hpps) % scene.hpps;
			scene.offsety = ((gridDimW - (parseFloat(scene.offsetx) || 0) - scene.hpps) % scene.vpps + scene.vpps) % scene.vpps;
		}

		if (scene.gridType == 2) scene.gridType = 3;
		else if (scene.gridType == 3) scene.gridType = 2;

		if (scene.scaleAdjustment) {
			const tempAdj = scene.scaleAdjustment.x;
			scene.scaleAdjustment.x = scene.scaleAdjustment.y;
			scene.scaleAdjustment.y = tempAdj;
		}
	} else if (angle === 180) {
		const gridDimW = (curRot === 90 || curRot === 270) ? rawH : rawW;
		const gridDimH = (curRot === 90 || curRot === 270) ? rawW : rawH;
		scene.offsetx = ((gridDimW - (parseFloat(scene.offsetx) || 0) - scene.hpps) % scene.hpps + scene.hpps) % scene.hpps;
		scene.offsety = ((gridDimH - (parseFloat(scene.offsety) || 0) - scene.vpps) % scene.vpps + scene.vpps) % scene.vpps;
	}

	// 3. Tokens Transformation
	if (scene.tokens) {
		console.log(`[AboveVTT Rotate] Transforming ${Object.keys(scene.tokens).length} tokens`);
		for (let id in scene.tokens) {
			let tok = scene.tokens[id];
			if (!tok) continue;
			let opt = tok.options || tok;
			let left = parseFloat(opt.left || tok.left || 0) || 0;
			let top = parseFloat(opt.top || tok.top || 0) || 0;
			let size = parseFloat(opt.size || tok.size || 60) || 60;
			let tokW = parseFloat(opt.sizeWidth || (typeof tok.sizeWidth === 'function' ? tok.sizeWidth() : tok.sizeWidth) || size) || size;
			let tokH = parseFloat(opt.sizeHeight || (typeof tok.sizeHeight === 'function' ? tok.sizeHeight() : tok.sizeHeight) || size) || size;

			let rect = transformRect(left, top, tokW, tokH);
			console.log(`[AboveVTT Rotate] Token ${id}: (${left}, ${top}) -> (${rect.x}, ${rect.y})`);
			opt.left = `${Math.round(rect.x)}px`;
			opt.top = `${Math.round(rect.y)}px`;
			tok.left = opt.left;
			tok.top = opt.top;

			const isAoe = opt.isAoe || tok.isAoe || (typeof opt.imgsrc === 'string' && opt.imgsrc.includes('aoe')) || (typeof tok.imgsrc === 'string' && tok.imgsrc.includes('aoe'));

			if (!keepTokensUpright || isAoe) {
				let rot = (parseFloat(opt.rotation || tok.rotation || 0) + angle) % 360;
				opt.rotation = rot;
				tok.rotation = rot;
			}

			if (opt.heading !== undefined) opt.heading = (parseFloat(opt.heading) + angle) % 360;
			if (opt.lightAngle !== undefined) opt.lightAngle = (parseFloat(opt.lightAngle) + angle) % 360;
			if (opt.lightRotation !== undefined) opt.lightRotation = (parseFloat(opt.lightRotation) + angle) % 360;
		}
	}

	// 4. Drawings, Walls, Elev, and Lights Transformation
	function transformDrawings(drawingsList) {
		if (!Array.isArray(drawingsList)) return;
		console.log(`[AboveVTT Rotate] Transforming ${drawingsList.length} drawings`);
		for (let i = 0; i < drawingsList.length; i++) {
			let d = drawingsList[i];
			if (!Array.isArray(d)) continue;
			let shape = d[0];
			let type = d[1];

			if (shape === 'line' || (typeof shape === 'string' && shape.includes('line')) || type === 'wall' || (type === 'elev' && shape === 'line')) {
				let pt1 = transformPoint(d[3], d[4]);
				let pt2 = transformPoint(d[5], d[6]);
				d[3] = pt1.x; d[4] = pt1.y; d[5] = pt2.x; d[6] = pt2.y;
			} else if (shape === 'rect' || shape === 'square' || shape === 'eraser' || (type === 'light' && shape === 'rect')) {
				let rect = transformRect(d[3], d[4], d[5], d[6]);
				d[3] = rect.x; d[4] = rect.y; d[5] = rect.w; d[6] = rect.h;
			} else if (shape === 'circle' || shape === 'arc' || (type === 'light' && (shape === 'circle' || shape === 'arc'))) {
				let pt = transformPoint(d[3], d[4]);
				d[3] = pt.x; d[4] = pt.y;
			} else if (shape === 'polygon' || shape === 'poly' || shape === 'freehand') {
				let points = d[3];
				if (Array.isArray(points)) {
					for (let p of points) {
						if (p && typeof p === 'object') {
							if ('x' in p && 'y' in p) {
								let pt = transformPoint(p.x, p.y);
								p.x = pt.x; p.y = pt.y;
							} else if (Array.isArray(p) && p.length >= 2) {
								let pt = transformPoint(p[0], p[1]);
								p[0] = pt.x; p[1] = pt.y;
							}
						}
					}
				}
			} else if (typeof shape === 'string' && shape.includes('text')) {
				let rect = transformRect(d[1], d[2], d[3], d[4]);
				d[1] = rect.x; d[2] = rect.y; d[3] = rect.w; d[4] = rect.h;
			}
		}
	}
	transformDrawings(scene.drawings);

	// 5. Fog of War Reveals Transformation
	function transformReveals(revealsList) {
		if (!Array.isArray(revealsList)) return;
		console.log(`[AboveVTT Rotate] Transforming ${revealsList.length} reveals`);
		for (let i = 0; i < revealsList.length; i++) {
			let d = revealsList[i];
			if (!Array.isArray(d)) continue;
			if (d.length === 4 || d[4] === 0) {
				let rect = transformRect(d[0], d[1], d[2], d[3]);
				d[0] = rect.x; d[1] = rect.y; d[2] = rect.w; d[3] = rect.h;
			} else if (d[4] === 1) {
				let pt = transformPoint(d[0], d[1]);
				d[0] = pt.x; d[1] = pt.y;
			} else if (d[4] === 3 || d[4] === 5 || d[4] === 6) {
				let points = d[0];
				if (Array.isArray(points)) {
					for (let p of points) {
						if (p && typeof p === 'object') {
							if ('x' in p && 'y' in p) {
								let pt = transformPoint(p.x, p.y);
								p.x = pt.x; p.y = pt.y;
							} else if (Array.isArray(p) && p.length >= 2) {
								let pt = transformPoint(p[0], p[1]);
								p[0] = pt.x; p[1] = pt.y;
							}
						}
					}
				}
			} else if (d[4] === 4) {
				let pt = transformPoint(d[0], d[1]);
				d[0] = pt.x; d[1] = pt.y;
			} else if (d[4] === 7) {
				let points = d[0];
				if (Array.isArray(points)) {
					for (let p of points) {
						if (Array.isArray(p) && p.length >= 2) {
							let pt = transformPoint(p[0], p[1]);
							p[0] = pt.x; p[1] = pt.y;
						}
					}
				}
			}
		}
	}
	transformReveals(scene.reveals);
}

/**
 * Rotates a scene by its ID, persists all changes (metadata, tokens, walls, fog), and updates display.
 * @param {string|number} scene_id 
 * @param {number} angle 
 * @param {boolean} keepTokensUpright 
 */
async function rotate_scene(scene_id, angle = 90, keepTokensUpright = true) {
	console.log('[AboveVTT Rotate] rotate_scene called:', { scene_id, angle, keepTokensUpright });
	let sceneIndex = window.ScenesHandler.scenes.findIndex(s => s.id == scene_id || s.uuid == scene_id);
	if (sceneIndex === -1 && typeof scene_id === 'number') sceneIndex = scene_id;
	let scene = window.ScenesHandler.scenes[sceneIndex];
	if (!scene && window.CURRENT_SCENE_DATA) scene = window.CURRENT_SCENE_DATA;
	if (!scene) {
		console.warn('[AboveVTT Rotate] No scene found for scene_id:', scene_id);
		return;
	}

	const isActive = window.CURRENT_SCENE_DATA && (
		window.CURRENT_SCENE_DATA.id == scene.id ||
		(scene.uuid && window.CURRENT_SCENE_DATA.uuid == scene.uuid) ||
		(scene.id && window.CURRENT_SCENE_DATA.uuid == scene.id) ||
		(scene.uuid && window.CURRENT_SCENE_DATA.id == scene.uuid) ||
		(window.CURRENT_SCENE_DATA.player_map && window.CURRENT_SCENE_DATA.player_map === scene.player_map)
	);

	console.log(`[AboveVTT Rotate] Scene matched. isActive=${isActive}, sceneIndex=${sceneIndex}`);

	if (isActive) {
		let fullScene = { ...window.CURRENT_SCENE_DATA };
		let origSavedScale = fullScene.scale_factor;
		if (sceneIndex !== -1 && window.ScenesHandler.scenes[sceneIndex]) {
			const savedScene = window.ScenesHandler.scenes[sceneIndex];
			if (savedScene.scale_factor !== undefined) origSavedScale = savedScene.scale_factor;
			if (savedScene.hpps !== undefined) fullScene.hpps = savedScene.hpps;
			if (savedScene.vpps !== undefined) fullScene.vpps = savedScene.vpps;
			if (savedScene.offsetx !== undefined) fullScene.offsetx = savedScene.offsetx;
			if (savedScene.offsety !== undefined) fullScene.offsety = savedScene.offsety;
		}
		fullScene.drawings = window.DRAWINGS ? $.extend(true, [], window.DRAWINGS) : (fullScene.drawings || []);
		fullScene.reveals = window.REVEALED ? $.extend(true, [], window.REVEALED) : (fullScene.reveals || []);
		fullScene.tokens = fullScene.tokens || {};
		for (let id in window.TOKEN_OBJECTS) {
			fullScene.tokens[id] = $.extend(true, {}, window.TOKEN_OBJECTS[id].options);
		}

		console.log('[AboveVTT Rotate] fullScene before rotate:', {
			rotation: fullScene.rotation,
			tokensCount: Object.keys(fullScene.tokens).length,
			drawingsCount: fullScene.drawings.length,
			revealsCount: fullScene.reveals.length
		});

		rotate_scene_data(fullScene, angle, keepTokensUpright);

		// Update global runtime references
		window.CURRENT_SCENE_DATA.rotation = fullScene.rotation;
		window.CURRENT_SCENE_DATA.hpps = fullScene.hpps;
		window.CURRENT_SCENE_DATA.vpps = fullScene.vpps;
		window.CURRENT_SCENE_DATA.offsetx = fullScene.offsetx;
		window.CURRENT_SCENE_DATA.offsety = fullScene.offsety;
		window.CURRENT_SCENE_DATA.drawings = fullScene.drawings;
		window.CURRENT_SCENE_DATA.reveals = fullScene.reveals;
		window.CURRENT_SCENE_DATA.tokens = fullScene.tokens;
		window.DRAWINGS = fullScene.drawings;
		window.REVEALED = fullScene.reveals;

		if (sceneIndex !== -1) {
			window.ScenesHandler.scenes[sceneIndex] = {
				...window.ScenesHandler.scenes[sceneIndex],
				...fullScene,
				scale_factor: origSavedScale,
				drawings: [],
				reveals: [],
				tokens: {}
			};
		}

		// Re-position every live token directly in DOM and sync message
		const curScaleFactor = parseFloat(window.CURRENT_SCENE_DATA?.scale_factor) || 1;
		for (let id in window.TOKEN_OBJECTS) {
			let tok = window.TOKEN_OBJECTS[id];
			if (fullScene.tokens[id]) {
				tok.options = $.extend(true, {}, fullScene.tokens[id]);
				if (window.CURRENT_SCENE_DATA.tokens) {
					window.CURRENT_SCENE_DATA.tokens[id] = tok.options;
				}
				const el = $(`#tokens div[data-id='${id}']`);
				console.log(`[AboveVTT Rotate] Updating DOM element for token ${id}: found=${el.length}, left=${tok.options.left}, top=${tok.options.top}`);
				if (el.length) {
					el.css({
						left: `${parseFloat(tok.options.left) / curScaleFactor}px`,
						top: `${parseFloat(tok.options.top) / curScaleFactor}px`
					});
					const rot = tok.options.rotation || 0;
					el.find('.token-image').css('transform', `rotate(${rot}deg)`);
				}
				window.MB.sendMessage('custom/myVTT/token', tok.options, false, fullScene.id);
			}
		}

		// Re-render canvas layers and map
		console.log('[AboveVTT Rotate] Calling reset_canvas and redraw functions');
		reset_canvas(false);
		redraw_light_walls({ wallsChanged: true });
		redraw_elev();
		redraw_drawings();
		redraw_text();
		redraw_drawn_light();
		redraw_light(true);
		redraw_fog();
		if (typeof redraw_grid === 'function') redraw_grid();
		if (typeof draw_svg_grid === 'function') draw_svg_grid();

		// Broadcast drawings and fog to peers
		sync_drawings({ wallsChanged: true });
		window.MB.sendMessage("custom/myVTT/fogdata", window.REVEALED);

		await window.ScenesHandler.persist_scene(sceneIndex !== -1 ? sceneIndex : scene_id, false);
		did_update_scenes();
		try {
			await AboveApi.migrateScenes(window.gameId, [fullScene]);
		} catch (e) {
			console.warn("AboveApi.migrateScenes rotate save:", e);
		}
	} else {
		// Inactive scene
		console.log('[AboveVTT Rotate] Rotating inactive scene via AboveApi');
		try {
			let fullSceneResponse = await AboveApi.getScene(scene.id || scene.uuid);
			let fullScene = fullSceneResponse?.data ? Object.values(fullSceneResponse.data)[0] : fullSceneResponse;
			if (fullScene) {
				rotate_scene_data(fullScene, angle, keepTokensUpright);
				window.ScenesHandler.scenes[sceneIndex] = {
					...window.ScenesHandler.scenes[sceneIndex],
					...fullScene,
					drawings: [],
					reveals: [],
					tokens: {}
				};
				await window.ScenesHandler.persist_scene(sceneIndex, false);
				did_update_scenes();
				await AboveApi.migrateScenes(window.gameId, [fullScene]);
			}
		} catch (e) {
			console.error("Error rotating inactive scene:", e);
			rotate_scene_data(scene, angle, keepTokensUpright);
			await window.ScenesHandler.persist_scene(sceneIndex, false);
			did_update_scenes();
		}
	}
}

window.rotate_scene_data = rotate_scene_data;
window.rotate_scene = rotate_scene;

