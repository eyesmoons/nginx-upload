$(function(){
    //modal 弹出框可拖动
    // $(".modal").each(function(){
    //   $(this).drags({handle:".modal-header"});
    // });

	$(".sidebar,.basiHeight").height($(window).height()-$(".Nheader").height()-2)
	$(".row-right").width($(".row").width()-$(".row-left").width())
	$(".sidebar a").not("[data-toggle=dropdown]").click(function(){
		$(".sidebar a").removeClass("active");
		$(this).addClass("active");
	});
	$(".sidebar a[data-toggle=dropdown]").click(function(){
		if(!$(".sidebar").is(".fold")){
			$(this).siblings(".menu-second,.menu-third").slideToggle()
			$(this).find(".arrow-down").toggleClass("active");
		}
	})
	$(".nav-pills li,.navbar li").click(function(){
		$(this).addClass("active").siblings().removeClass("active");
	});
	$(".navbar li a").click(function(){
		$(this).addClass("active")
		$(this).parent().siblings().children().removeClass("active");
	});
	//主页 右上角 功能控制 begin
	$(".login-dian").on("click",function(){
		$(".login-con").toggle();
	});
	$(".pop_attach-a").hover(
		function(){
			$(this).children(".popover-a").show();
		},function(){
			$(this).children(".popover-a").hide();
		}
	)
	$(".pop_attach-c").hover(
		function(){
			$(this).children(".popover-c").show();
		},function(){
			$(this).children(".popover-c").hide();
		}
	)
	//主页 右上角 功能控制 end


	$(".login-info1,.nav li:last-child").hover(function(){
		$(this).find(".downlist").toggle();
	});

	$(".login-info1 .downlist").width($(".login-info1").width())

	$(".nav .downlist a").click(function(){
		$("#initName").html($(this).text()+" <i class='arrow-down'></i>")
		$(this).addClass("active").siblings().removeClass("active");
	})

	$('.menuSel ul li a').click(function(e){
		e.stopPropagation();
		$(this).find('i').hasClass('active') ? $(this).find('i').removeClass('active'):$(this).find('i').addClass('active');
		$(this).parent().hasClass('open') ? $(this).parent().removeClass('open'):$(this).parent().addClass('open');
	});
	$('.menuSel ul li input').click(function(e){
		e.stopPropagation();
	});

	$('.menu-first>li:not(:eq(0))').each(function(){
		$(this).find('a').eq(0).click();
	});
	
	/*树结构*/
	$('.menu_tree_A .btn_kg, .listChoB .btn_kg').click(function(){
		$(this).parent().toggleClass('zk')
	})
	$('.menu_tree_A .name').click(function(){
		$('.menu_tree_A .name').removeClass('on')
		$(this).addClass('on')
	})
})
