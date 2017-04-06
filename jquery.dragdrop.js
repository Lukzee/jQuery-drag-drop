
(function( $ ){
    var items           =   [];
    var initmousedownrv =   0;

    function removeCurrentDropHere(th) {

        var wraptable   =   $(th).closest(".jqdad-wrap-table tbody");
        var crow        =   0;
        var frow        =   0;
        var fcol        =   0;
        var colitems    =   [];

        wraptable.find("tr.jqdad-row").each(function() {
            crow++;
            var ccol    =   0;
            $(this).children().each(function() {
                ccol++;
                if(fcol==ccol) {
                    colitems.push($(this).clone(true));
                }
                if($(this).hasClass("jgdad-drop-here")) {
                    frow        =   crow;
                    fcol        =   ccol;
                }
            });
        });

        if(frow>0) {
            crow        =   0;
            wraptable.find("tr.jqdad-row").each(function() {
                crow++;
                var ccol    =   0;
                $(this).children().each(function() {
                    ccol++;
                    if(crow>=frow && ccol==fcol) {
                       html    =   colitems.shift();
                       if(html==undefined) {
                           html =   '<td class="jqdad-empty-ceil"></td>';
                       }
                       $(html).insertBefore(this);
                       $(this).remove();
                    }
                });
            });
        }

        var itemfind    =   true;
        wraptable.find("tr.jqdad-row:last-child").children().each(function() {
            if(!$(this).hasClass("jqdad-empty-ceil")) {
                itemfind    =   false;
            }
        });

        if(itemfind) {
            wraptable.find("tr.jqdad-row:last-child").remove();
        }

    }

    function beginMouseEnter(th) {

        removeCurrentDropHere(th);

        var wraptable   =   $(th).closest(".jqdad-wrap-table tbody");

        var currow  =   0;
        var curcol  =   0;
        var frow    =   0;
        var fcol    =   0;

        var colitems    =   [];


        wraptable.find("tr.jqdad-row").each(function() {
            currow++;
            curcol  =   0;
            $(this).children().each(function() {
                    curcol++;
                    if(fcol>0 && fcol==curcol) {
                        colitems.push($(this).clone(true));
                    }
                    if(!$(this).hasClass("jqdad-empty-ceil")) {
                        if(this==th) {
                            frow    =   currow;
                            fcol    =   curcol;
                            colitems.push($(this).clone(true));
                        }
                    }
            });
        });

        if(frow==0) { return; }

        currow  =   0;
        wraptable.find("tr.jqdad-row").each(function() {
            currow++;
            curcol  =   0;
            $(this).children().each(function() {
                curcol++;
                if(curcol==fcol) {
                    if(currow==frow) {
                        $("<td class='jgdad-drop-here'></td>").insertBefore(this);
                        visualPrepareDropHere();
                        $(this).remove();
                    }
                    if(currow>frow) {
                        $(colitems.shift()).insertBefore(this);
                        $(this).remove();
                    }
                }
            });
        });

        if(colitems.length>0) {
            var ilosckolumn =   wraptable.closest("table").find("thead th").length;
            var str     =   '';
            for(x=0;x<ilosckolumn;x++) {
                str =   str + '<td class="jqdad-empty-ceil"></td>';
            }
            wraptable.append("<tr class='jqdad-row'>" + str + "</tr>");
            curcol =   0;
            wraptable.find("tr.jqdad-row:last-child").children().each(function() {
                curcol++;
                if(curcol==fcol) {
                    objhtml    =   colitems.shift();
                    $(objhtml).insertBefore(this);
                    $(this).remove();
                }
            });
        }


        var itemfind    =   true;
        wraptable.find("tr.jqdad-row:last-child").children().each(function() {
            if(!$(this).hasClass("jqdad-empty-ceil")) {
                itemfind    =   false;
            }
        });

        if(itemfind) {
            wraptable.find("tr.jqdad-row:last-child").remove();
        }

    }

    function initMouseDown(th, ev) {

        $(th).clone(true);
        var wraptable   =   $(th).closest(".jqdad-wrap-table");

        if(wraptable.find(".jqdad-element-for-move").length>0) {
            wraptable.find(".jqdad-element-for-move").removeClass("jqdad-element-for-move");
        }

        $(th).clone().addClass("jgdad-moved-item").appendTo( wraptable );
        $(th).addClass("jqdad-element-for-move");

        var item    =   $(".jgdad-moved-item");
        var w       =    Math.floor( item.width() / 2);
        item.css("left", ev.pageX - w);
        item.css("top", ev.pageY + 20);

        runCallBackAfterDrag(wraptable.attr("jqdadindex"), th);

    }

    function deleteCeilInTable(ceil) {
        var wraptable   =   $(ceil).closest(".jqdad-wrap-table tbody");
        var currow  =   0;
        var curcol  =   0;
        var frow    =   0;
        var fcol    =   0;
        var colitems    =   [];
        wraptable.find("tr.jqdad-row").each(function() {
            currow++;
            curcol  =   0;
            $(this).children().each(function() {
                curcol++;
                if(fcol>0 && fcol==curcol) {
                    colitems.push($(this).clone(true));
                }
                if(this==ceil) {
                    frow    =   currow;
                    fcol    =   curcol;
                }
            });
        });
        currow  =   0;
        wraptable.find("tr.jqdad-row").each(function() {
            currow++;
            curcol  =   0;
            $(this).children().each(function() {
                curcol++;
                if(curcol==fcol) {
                    if(currow>=frow) {
                        var sethtml =   colitems.shift();
                        if(sethtml==undefined) {
                            sethtml =   '<td class="jqdad-empty-ceil"></td>';
                        }
                        $(sethtml).insertBefore(this);
                        $(this).remove();
                    }
                }
            });
        });
    }

    function visualPrepareDropHere() {
        h   =   $(".jgdad-moved-item").height();
        $(".jgdad-drop-here").height(h);
    }

    function saveceilInTable() {

        var item    =   $(".jqdad-element-for-move");

        if(item.length==0) {
            return;
        }

        var moveitem    =   item.clone(true).removeClass("jqdad-element-for-move");
        var wraptable   =   item.closest(".jqdad-wrap-table");

        if(wraptable.find(".jgdad-drop-here").length==0) {
            return;
        }

        $(moveitem).insertBefore(wraptable.find(".jgdad-drop-here"));
        wraptable.find(".jgdad-drop-here").remove();

        item.each(function() {
            var tabid   =   $(this).closest(".jqdad-wrap-table").attr("jqdadindex");
            deleteCeilInTable(this);
            runCallBackAfterDrop(tabid, moveitem);
        });

    }

    function moveElementAfterTable(event) {

        if($(".jgdad-moved-item").length==0) {
            return;
        }

        var wraptable   =   $(".jqdad-wrap-ismoved");
        var offset      =   wraptable.offset();
        var bottom      =   offset.top + wraptable.outerHeight();

        var headerth    =   wraptable.find("thead th");
        ilosckolumn =   headerth.length;

        var tableendceil    =   [];
        for(x=1;x<=ilosckolumn;x++)  {
            tableendceil[x] =   0;
        }

        var currow          =   0;
        var curceil         =   0;
        wraptable.children("tbody").find("tr.jqdad-row").each(function() {
            currow++;
            curceil          =   0;
            $(this).children().each(function() {
                curceil++;
                if(!$(this).hasClass("jqdad-empty-ceil")) {
                    bottom      =   $(this).offset().top + $(this).outerHeight();
                    tableendceil[curceil]   =   Math.max(tableendceil[curceil], bottom);
                }
            });

        });

        var curcol      =   0;
        var find        =   0;

        var begin       =   0;
        var end         =   0;

        headerth.each(function() {
            curcol++;
            begin   =   $(this).offset().left;
            end     =   begin + $(this).outerWidth();
            if(event.pageX>=begin && event.pageX<=end) {
                find    =   curcol;
            }
        });

        if(find > 0 && event.pageY>tableendceil[find]) {

                // drop here on last item

                $(".jqdad-wrap-table tbody tr.jqdad-row:first-child td:first-child").each(function() {
                    removeCurrentDropHere(this);
                });

                var addrow  =   true;
                wraptable.find("tr.jqdad-row").each(function() {
                    var currentcol    =   0;
                    $(this).children().each(function() {
                        currentcol++;
                        if(currentcol==find) {

                            if(!$(this).hasClass("jgdad-drop-here")) {
                                if($(this).hasClass("jqdad-empty-ceil") && addrow==true) {
                                    addrow  =   false;
                                    $("<td class='jgdad-drop-here'></td>").insertBefore(this);
                                    visualPrepareDropHere();
                                    $(this).remove();
                                }
                            } else {
                                addrow  =   false;
                            }
                        }
                    });
                });

                if(addrow) {
                    var setstr  =   "<tr class='jqdad-row'>";
                    for(x=1;x<=ilosckolumn;x++) {
                        if(x==find) {
                            setstr  =   setstr + "<td class='jgdad-drop-here'></td>";
                        } else {
                            setstr  =   setstr + "<td class='jqdad-empty-ceil'></td>";
                        }
                    }
                    setstr  +=   "</tr>";
                    wraptable.children("tbody").append(setstr);
                    visualPrepareDropHere();
                }

        }

    }

    function runCallBackAfterDrag(attrid, element) {
        if(typeof items[attrid] === 'object') {
            var idset   =   $(items[attrid]).attr("id");
            items[attrid].options.afterDrag(idset, element);
        }
    }

    function runCallBackAfterDrop(attrid, element) {
        if(typeof items[attrid] === 'object') {

            var idset   =   $(items[attrid]).attr("id");
            items[attrid].options.afterDrop(idset, element);
        }
    }

    $.fn.jqdraganddrop	=	function(options) {

        return  this.each(function() {

            var xc  =   items.length;

            this.jqdadindex =   xc;

            var optionsset  =   {
                afterDrop:  function(tabid, el) { } ,
                afterDrag:  function(tabid, el) { }
            };

            if(typeof options === 'object') {
                jQuery.extend( optionsset , options );
            }

            $(this).attr("jqdadindex", xc);
            $(this).addClass("jqdad-wrap-table", xc);

            var xrow    =   0;
            var xcol    =   0;
            $(this).find("tbody tr.jqdad-row").each(function() {
                xrow++;
                xcol    =   0;
                $(this).children().each(function() {
                    xcol++;
                    var id  =   xrow + "_" + xcol;
                    $(this).attr("jqdad-id-ceil", id);
                    if($(this).html().trim()=='') {
                        $(this).addClass("jqdad-empty-ceil");
                    }
                });
            });

            $(this).find("tbody tr.jqdad-row").children().mouseenter(function(event) {
                if(!$(this).closest(".jqdad-wrap-table").hasClass("jqdad-wrap-ismoved")) {
                    return;
                }
                if($("body").hasClass("jgdad-noselect")) {
                    // jeśli uruchomiona animacja
                    beginMouseEnter(this, event);
                }
            });


            $(this).find("tbody tr.jqdad-row").children().mousedown(function(event) {
                if($(this).hasClass("jqdad-empty-ceil")) { return; }
                initmousedownrv =   Math.random();
                $("body").addClass("jgdad-noselect");
                setTimeout(function(th, ev, rv) {
                    if(initmousedownrv==rv) {
                        $(".jqdad-wrap-ismoved").removeClass("jqdad-wrap-ismoved");
                        $(th).closest(".jqdad-wrap-table").addClass("jqdad-wrap-ismoved");
                        initMouseDown(th, ev);
                    }
                }, 250, this, event, initmousedownrv);
            });

            $(document).mousemove(function( event ) {
                var item    =   $(".jgdad-moved-item");
                var w       =   Math.floor( item.width() / 2);
                item.css("left", event.pageX - w);
                item.css("top", event.pageY + 20);
                if($("body").hasClass("jgdad-noselect")) {
                    moveElementAfterTable(event);
                }
            });

            $(document).mouseup(function() {
                initmousedownrv =   0;
                $(".jqdad-wrap-ismoved").removeClass("jqdad-wrap-ismoved");
                var item    =   $("body");

                item.removeClass("jgdad-noselect");
                item.find(".jgdad-moved-item").remove();
                saveceilInTable();
                $(".jqdad-wrap-table tbody tr.jqdad-row:first-child td:first-child").each(function() {
                    removeCurrentDropHere(this);
                });
            });

            this.options    =   optionsset;
            items.push(this);

        });

    };

})(jQuery);
