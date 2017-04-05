
(function( $ ){
    var items   =   [];

    function removeCurrentDropHere(th) {

        wraptable   =   $(th).closest(".jqdad-wrap-table tbody");

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

        itemfind    =   true;
        wraptable.find("tr.jqdad-row:last-child").children().each(function() {
            if(!$(this).hasClass("jqdad-empty-ceil")) {
                itemfind    =   false;
            }
        });

        if(itemfind) {
            wraptable.find("tr.jqdad-row:last-child").remove();
        }


    }

    function beginmouseenter(th, e) {
        // insert before

        removeCurrentDropHere(th);

        /*
        var scrollfrom  =   'top';
        var offset   =   $(th).offset();
        var bottom   =  offset.top + $(th).outerHeight();
        var diff1   =   Math.abs(event.pageY - bottom);
        var diff2   =   Math.abs(event.pageY - offset.top);
        if(diff1<diff2) {
            scrollfrom  =   'bottom';
        }
        */

        // setowanie elementu w kolumnie w któ©ej wybrano
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

    function initmousedown(th, ev) {

        $(th).clone(true);
        var wraptable   =   $(th).closest(".jqdad-wrap-table");

        if(wraptable.find(".jqdad-element-for-move").length>0) {
            // console.log(" ZA DUŻO ELEMENTOW ");
            wraptable.find(".jqdad-element-for-move").removeClass("jqdad-element-for-move");
        }

        $(th).clone().addClass("jgdad-moved-item").appendTo( wraptable );
        $(th).addClass("jqdad-element-for-move");

        var w      =    Math.floor( $(".jgdad-moved-item").width() / 2);
        $(".jgdad-moved-item").css("left", ev.pageX - w);
        $(".jgdad-moved-item").css("top", ev.pageY + 20);

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

        if($(".jqdad-element-for-move").length==0) {
            return;
        }

        var moveitem    =   $(".jqdad-element-for-move").clone(true).removeClass("jqdad-element-for-move");
        var wraptable   =   $(".jqdad-element-for-move").closest(".jqdad-wrap-table");

        if(wraptable.find(".jgdad-drop-here").length==0) {
            return;
        }

        $(moveitem).insertBefore(wraptable.find(".jgdad-drop-here"));
        wraptable.find(".jgdad-drop-here").remove();

        $(".jqdad-element-for-move").each(function() {
            deleteCeilInTable(this);
            runCallBackAfterDrop($(this).closest(".jqdad-wrap-table").attr("jqdadindex"));
        });

    }

    function moveElementAfterTable(event) {

        if($(".jgdad-moved-item").length==0) {
            return;
        }

        var wraptable   =   $(".jgdad-moved-item").closest(".jqdad-wrap-table");
        var offset      =   wraptable.offset();
        var bottom      =   offset.top + wraptable.outerHeight();

        headerth    =   wraptable.find("thead th");
        ilosckolumn =   headerth.length;

        tableendceil    =   [];
        for(x=1;x<=ilosckolumn;x++)  {
            tableendceil[x] =   0;
        }

        currow          =   0;
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

                addrow  =   true;
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
                    setstr  =   "<tr class='jqdad-row'>";
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

    function runCallBackAfterDrop(attrid) {
        // runCallBackAfterDrop

        if(typeof items[attrid] === 'object') {
            idset   =   items[attrid].attr("id");
            items[attrid].options.afterDrop(idset);
        }

    }

    $.fn.jqdraganddrop	=	function(options) {

        var xc  =   items.length;

        this.jqdadindex =   xc;

        optionsset  =   {
            afterDrop:  function(tabid) { }
        };

        if(typeof options === 'object') {
            jQuery.extend( optionsset , options );
        }

        $(this).attr("jqdadindex", xc);
        $(this).addClass("jqdad-wrap-table", xc);

        var xrow    =   0;
        $(this).find("tbody tr.jqdad-row").each(function() {
            xrow++;
            xcol    =   0;
            $(this).children().each(function() {
                xcol++;
                id  =   xrow + "_" + xcol;
                $(this).attr("jqdad-id-ceil", id);
                if($(this).html().trim()=='') {
                    $(this).addClass("jqdad-empty-ceil");
                }
            });
        });

        $(this).find("tbody tr.jqdad-row").children().mouseenter(function(event) {
            if($("body").hasClass("jgdad-noselect")) { // jeśli uruchomiona animacja
                beginmouseenter(this, event);
            }
        });


        $(this).find("tbody tr.jqdad-row").children().mousedown(function(event) {
            if($(this).hasClass("jqdad-empty-ceil")) {
                return;
            }
            $("body").addClass("jgdad-noselect");
            initmousedown(this, event);
        });

        $(document).mousemove(function( event ) {
            w      =    Math.floor( $(".jgdad-moved-item").width() / 2);
            $(".jgdad-moved-item").css("left", event.pageX - w);
            $(".jgdad-moved-item").css("top", event.pageY + 20);
            if($("body").hasClass("jgdad-noselect")) {
                moveElementAfterTable(event);
            }
        });

        $(document).mouseup(function() {

            $("body").removeClass("jgdad-noselect");
            $("body").find(".jgdad-moved-item").remove();

            saveceilInTable();

            $(".jqdad-wrap-table tbody tr.jqdad-row:first-child td:first-child").each(function() {
                removeCurrentDropHere(this);
            });

        });

        this.options    =   optionsset;
        items.push(this);

        return  this.each(function() { });

    };

})(jQuery);
