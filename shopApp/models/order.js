import moment from 'moment';

class Order {
	constructor(id, items, totalAmount, date) {
		this.id = id;
		this.items = items;
		this.totalAmount = totalAmount;
		this.date = date;
	}

	get readableDate() {
		//   return this.date.toLocaleDateString('en-EN', {
		//       year: 'numeric',
		//       month: 'long',
		//       day: 'numeric',
		//       hour: '2-digit',
		//       minute: '2-digit'
		//   });

		// toLocaleDateString() is unstable ( or not entirely supported  )on android so we used third party package to foramt date.
		return moment(this.date).format('MMMM Do YYYY, hh:mm');
	}
}

export default Order;