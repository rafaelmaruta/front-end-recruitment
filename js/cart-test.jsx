// Main stateful component
var ProductsTable = React.createClass({
	// Initial states
	getInitialState: function() {
		return {
			cartClass        : [], // State to receive the css className if the cart section is open
			list             : {}, // Quantity list of products
			products         : [], // Product list loaded from JSON
			productsCart     : [], // Product list displayed on the cart
			totalInstallments: 0, // Total quantity of products on the cart displayed under the bag icon
			totalQuantity    : [], // Total quantity of products on the cart displayed under the bag icon
			totalPrice       : 0 // Total price displayed at the end of the cart
		};
	},
	// Loads the JSON file of products before any action
	componentDidMount: function() {
		$.getJSON(config.url_json, function(data) {
			// Stores the products data in a 'products' state
			this.setState({products: data.products});
			// Checks if there's a list of cart products cached in a local storage...
			if (localStorage.getItem('productCartList') !== null) {
				// ... to mount a list of cart products
				this.storagedProductsCart();
			};
		}.bind(this));
	},
	// Mounts the list of cart products based on a cached local storage
	storagedProductsCart: function() {
		// Sets the 'list' state with the product cart list quantity
		this.setState({list: JSON.parse(localStorage.getItem('productCartList'))});
		// Scans the 'list' state and mounts the products list displayed on the cart
		$.each(this.state.list, function(idx, elem) {
			// Returns the product array index based on its product id
			var index = this.state.products.findIndex(function(product) {
				return product.id == idx.replace('p-', '');
			});
			// Pushes the product in the 'productsCart' state
			this.state.productsCart.push(this.state.products[index]);
			// Updates the state
			this.setState({products: this.state.products, cartClass: 'open'});
			// Recalculates the total purchase
			this.calcTotal();
		}.bind(this));
	},
	// Adds the products to the cart
	addToCart: function(id) {
		// Returns the product array index based on its product id
		var index = this.state.products.findIndex(function(product) {
			return product.id == id;
		});
		// Gets the specified product in 'products' list state
		var product = this.state.products[index];
		// If the product isn't on the cart...
		if (this.state.productsCart.indexOf(product) == -1) {
			// ... starts to count its quantity
			this.state.list['p-' + product.id] = 1;
			// And pushes it to the 'productsCart' list state
			this.state.productsCart.push(product);
			// Updates the state
			this.setState({products: this.state.products});
		} else {
			// But if already is, increases its quantity
			this.state.list['p-' + product.id]++;
			// Updates the state
			this.setState({list: this.state.list});
		};
		// Opens the cart section
		this.setState({cartClass: 'open'});
		// Recalculates the total purchase
		this.calcTotal();
	},
	// Removes the products from the cart
	removeFromCart: function(id) {
		// Decreases the product quantity in the 'list' state
		this.state.list['p-' + id]--;
		// If the product quantity arrives to zero...
		if (this.state.list['p-' + id] == 0) {
			// ... removes its array key from the 'list' state
			delete this.state.list['p-' + id];
			// Returns the product array index based on its product id
			var index = this.state.productsCart.findIndex(function(product) {
				return product.id == id;
			});
			// If the product quantity is equal to zero, removes its array key from the 'productCart' list state
			this.state.productsCart.splice(index, 1);
		};
		// Sets the new 'list' state
		this.setState({list: this.state.list});
		// Recalculates the total purchase
		this.calcTotal();
	},
	// Recalculates the total purchase if any product is added or removed from the cart
	calcTotal: function() {
		var totalInstallments = 0,
			totalQuantity     = 0,
			totalPrice        = 0;

		// Saves the list of products in a local storage
		localStorage.setItem('productCartList', JSON.stringify(this.state.list));

		this.state.productsCart.forEach(function(elem) {
			// Gets the total installments
			totalInstallments += elem['installments'] * this.state.list['p-' + elem['id']];
			// Gets the total quantity of products on the cart
			totalQuantity     += this.state.list['p-' + elem['id']];
			// Gets the price of each product and multiples for its quantity
			totalPrice        += elem['price'] * this.state.list['p-' + elem['id']];
		}.bind(this));

		// Gets the total installments and divides for the products quantity
		totalInstallments = Math.floor(totalInstallments / totalQuantity);

		// Updates the state
		this.setState({
			totalInstallments: totalInstallments,
			totalQuantity    : totalQuantity,
			totalPrice       : totalPrice
		});
	},
	// Submits the purchase through AJAX (not functional)
	submitPurchase: function(e) {
		e.preventDefault();
		$.post(config.url_submit, {products: this.state.products, list: this.state.list}, function(e) {
			console.log('Submit message:', e);
		});
	},
	// Hides the cart section if the mouse leaves the cart area
	cartMouseLeave: function() {
		this.setState({cartClass: 'closed'});
	},
	// Displays the cart section if the mouse approaches near the black border
	cartMouseMove: function(e) {
		var tempX = -(e.clientX - $('#products').offset().left - $('#products').width());
		if (tempX <=  config.cartArea) {
			// Updates the state
			this.setState({cartClass: 'open'});
		};
	},
	render: function() {
		// Mounts the products catalog
		var productRows = this.state.products.map(function(product) {
            return (
				<li className="col-md-4 col-sm-6 col-xs-12 center-xs">
	            	<a href="javascript:void(0);" title={product.title} onClick={() => this.addToCart(product.id)}>
						<Photo image={config.dir_content + product.title.toSeo() + ".jpg"} title={product.title} description={product.description} />
						<Title title={product.title} description={product.description} separator=" - "/>
						<Price currencyFormat={product.currencyFormat} price={product.price} />
						<Installments text="ou" currencyFormat={product.currencyFormat} price={product.price} installments={product.installments} />
					</a>
				</li>
            );
		}.bind(this));

		// Global shop cart structure
		return (
			<div className="shopping">
				<section id="products" className="col-xs-12" onMouseMove={this.cartMouseMove}>
					<ul className="row">
						{productRows}
					</ul>
				</section>
				<aside id="cart" className={this.state.cartClass} onMouseLeave={this.cartMouseLeave}>
					<ProductsCart products={this.state.productsCart} list={this.state.list} totalInstallments={this.state.totalInstallments} totalPrice={this.state.totalPrice} totalQuantity={this.state.totalQuantity} onRemoveFromCart={this.removeFromCart} onSubmitPurchase={this.submitPurchase} />
				</aside>
			</div>
		);
	}
});

// The Photo mini component
var Photo = React.createClass({
	render: function() {
		return (
			<figure>
				<img src={this.props.image} alt={this.props.title} />
			</figure>
		);
	}
});

// The Title mini component
var Title = React.createClass({
	render: function() {
		return (
			<h4 className="title">{this.props.title + (this.props.description.trim() !== '' ? this.props.separator : '') + this.props.description}</h4>
		);
	}
});

// The Price mini component
var Price = React.createClass({
	render: function() {
		var price = formatPrice.getSplit(this.props.price);
		return <p className="price">{this.props.currencyFormat} <strong>{price.int}</strong>,{price.float}</p>
	}
});

// The Installments mini component
var Installments = React.createClass({
	render: function() {
		if (this.props.installments > 1) {
			var installments = formatPrice.getInstallments(this.props.installments, this.props.price);
			return <p className="installments">{this.props.text} {this.props.installments} x <strong>{this.props.currencyFormat} {installments}</strong></p>
		} else {
			return false;
		};
	}
});

// The Product Cart component
var ProductsCart = React.createClass({
	// Calls the remove method from the component above it in the hierarchy
	removeFromCart: function(id) {
		this.props.onRemoveFromCart(id);
	},
	render: function() {
		// Mounts each cart product
		var cartRows = this.props.products.map(function(product) {
            return (
            	<CartRow product={product} quantity={this.props.list['p-' + product.id]} onClick={this.removeFromCart} onMouseOver={this.deleteState}/>
            );
        }.bind(this));

		return (
			<form className="col-xs-12" role="form" onSubmit={this.props.onSubmitPurchase}>
				<h3 className="cart-title"><span className="bag"><div className="total">{this.props.totalQuantity}</div></span>Sacola</h3>
				<ul>
					{cartRows}
					<CartConclude totalInstallments={this.props.totalInstallments} totalPrice={this.props.totalPrice} />
				</ul>
			</form>
		);
	}
});

var CartRow = React.createClass({
	getInitialState: function() {
		return {deleteClass: []}; // State to change the layout of the product cart when the delete button is on mouse over
	},
	// Calls the remove method from the component above it in the hierarchy
	removeFromCart: function(id) {
		this.props.onClick(id);
	},
	// Changes the layout of the product cart through its state
	deleteState: function(className) {
		className = className || '';
		this.setState({deleteClass: className});
	},
	render: function() {
		var product = this.props.product;
		return (
			<li className={"row middle-xs " + this.state.deleteClass}>
				<hr />
				<div className="col-xs-12 col-sm-9 start-sm">
					<Photo image={config.dir_content + product.title.toSeo() + "_thumb.jpg"} title={product.title} description={product.description} />
					<Title title={product.title} description={product.description} separator=" " />
					<CartSize availableSizes={product.availableSizes} style={product.style} />
					<CartQuantity quantity={this.props.quantity} />
				</div>
				<div className="col-xs-12 col-sm-3 end-xs">
					<CartDelete onRemoveFromCart={() => this.removeFromCart(product.id)} onMouseOver={() => this.deleteState('delete')} onMouseOut={this.deleteState} />
					<Price currencyFormat={product.currencyFormat} price={product.price * this.props.quantity} />
				</div>
			</li>
		);
	}
});

// The Cart Size mini component
var CartSize = React.createClass({
	render: function() {
		return (
			<p className="size">{this.props.availableSizes.join(' ')} | {this.props.style}</p>
		);
	}
});

// The Cart Quantity mini component
var CartQuantity = React.createClass({
	render: function() {
		return (
			<p className="quantity">Quantidade: {this.props.quantity}</p>
		);
	}
});

// The Cart Delete mini component
var CartDelete = React.createClass({
	render: function() {
		return (
			<a href="javascript:void(0);" className="close ico-cancel33" onClick={this.props.onRemoveFromCart} onMouseOver={this.props.onMouseOver} onMouseOut={this.props.onMouseOut}></a>
		);
	}
});

// The Cart Conclusion component
var CartConclude = React.createClass({
	render: function() {
		return (
			<li className="row conclude">
				<hr />
				<p className="subtotal col-xs-12 col-sm-6 start-sm">Subtotal</p>
				<div className="col-xs-12 col-sm-6 end-sm">
					<Price currencyFormat={config.currencyFormat} price={this.props.totalPrice} />
					<Installments text="ou em até" currencyFormat={config.currencyFormat} installments={this.props.totalInstallments} price={this.props.totalPrice} />
				</div>
				<CartSubmit />
			</li>
		);
	}
});

// The Cart Submit mini component
var CartSubmit = React.createClass({
	render: function() {
		return (
			<div className="col-xs-12 btn-buy-container">
				<input type="submit" className="btn-buy" value="Comprar" />
			</div>
		);
	}
});

// Renders the application
ReactDOM.render(
	<ProductsTable />,
	document.getElementById('container')
);
