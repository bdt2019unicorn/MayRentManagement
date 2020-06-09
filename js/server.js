function AjaxRequest(url, data={}, type="get") 
{
	var result = null; 
	$.ajax
	(
		{
			type: type, 
			url: url, 
			data: data, 
			async: false, 
			contentType: false,
			processData: false,
			enctype: 'multipart/form-data',
			success: function(success)
			{
				result = success; 
			}, 
			error: function(error)
			{
				console.log("error"); 
				result = error; 
			}
		}
	); 
	return result; 
}