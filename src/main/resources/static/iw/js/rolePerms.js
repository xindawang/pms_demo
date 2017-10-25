rolesPerm();
function  rolesPerm(){
	var perms = $.find("[roles]");
	for (var i = 0, hasPerm = false; perm = perms[i]; i++) {
		if ( $.cookie("perms") && $.cookie("perms").include( $(perm).attr("roles") )) {
			continue;
		}
		if (!hasPerm) $(perm).remove();
		hasPerm = false;
	}
}
