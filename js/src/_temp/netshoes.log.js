// Config data
var config = {
	cartArea      : 30, // Area in px that if the mouse enters, the cart section is displayed
	currencyFormat: 'R$',
	dir_content   : 'content/', // Directory of photos
	url_json      : 'data/products.json', // JSON data of products provided
	url_submit    : '/' // URL for purchase submit through AJAX
};

// Converts any string to SEO format
String.prototype.toSeo = function() {
	var with_accent = 'áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ/',
		no_accent   = 'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC-',
		new_str     = '';

	for (var i = 0; i < this.length; i++) {
		if (with_accent.search(this.substr(i, 1)) >= 0) {
			new_str += no_accent.substr(with_accent.search(this.substr(i, 1)), 1);
		} else {
			new_str += this.substr(i, 1);
		};
	};
	return new_str.toLowerCase().replace(/ /g, "-");
};

// Object methods for formatting prices
var formatPrice = {
	// Splits the float number and returns the int and float parts in an object
	getSplit: function(price) {
		price = price.toFixed(2).toString().split('.');
		return {int: price[0], float: price[1]};
	},
	// Calculates the installment value and returns it with comma
	getInstallments: function(installments, price) {
		return installments > 1 ? (price / installments).toFixed(2).replace('.', ',') : '';
	}
};