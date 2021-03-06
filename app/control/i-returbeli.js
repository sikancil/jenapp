/**
 * Created by rappresent on 12/12/14.
 */
function IReturBeli() {
}

IReturBeli.prototype.initialize = function () {
	var me = this;
	me.data = {};
	me.Date = new Date();
	me.date = this.Date.getFullYear() + "-" + this.Date.getMonth() + "-" + this.Date.getDate();
	me.module = $('div[page="i-returbeli"]');
	me.elements = {
		containerNew       : {
			object: "#containerNew"
		},
		containerSearch    : {
			object: "#containerSearch"
		},
		btnShowConNew      : {
			object: "#btnShowConNew",
			events: ["clickBtnShowConNew"]
		},
		btnShowConSearch   : {
			object: "#btnShowConSearch",
			events: ["clickBtnShowConSearch"]
		},
		btnResetTrans      : {
			object: "#btnResetTrans",
			events: ["clickBtnResetTrans"]
		},
		btnSubmitTrans     : {
			object: "#btnSubmitTrans",
			events: ["clickBtnSubmitTrans"]
		},
		inputOrderNumb     : {
			object: "#inputOrderNumb"
		},
		inputDateTrans     : {
			object: "#inputDateTrans",
			config: ["confInputDateTrans"],
			events: ["inputSetDataValue"]
		},
		inputTransNumb     : {
			object: "#inputTransNumb",
			events: ["changeInputTransNumb"]
		},
		inputTotalQty      : {
			object: "#inputTotalQty"
		},
		inputTotalItems    : {
			object: "#inputTotalItems"
		},
		inputInternal      : {
			object: "#inputInternal",
			config: ["confInputInternal"]
		},
		textareaNotes      : {
			object: "#textareaNotes",
			events: ["inputSetDataValue"]
		},
		tableOrderPembelian: {
			object: "#tableOrderPembelian",
			config: ["confTableOrderPembelian"]
		}
	};

	me.focusAt = "";

	me.ajax(me.prepare());
};

IReturBeli.prototype.ajax = function (callback) {
	var cb, me = this;
	if (callback) {
		typeof callback == 'function' ? (cb = callback()) : (cb = callback);
		return cb;
	}
};

IReturBeli.prototype.prepare = function () {
	var me = this;

	Object.keys(me.elements).forEach(function (key) {
		me.initEl(key, me.elements[key].object);
	});

	me.elements.containerSearch.object.hide();
	me.elements.containerNew.object.show();
};

IReturBeli.prototype.initEl = function (key, object) {
	var me = this;
	var key = me.elements[key];
	if (me.module.length == 1) {
		if (me.module.find(object).length > 0) {
			key.object = me.module.find(object);
			if (typeof key.object !== "string") {
				key.object.unbind(); //remove all events handler

				if (key.config)
					key.config.forEach(function (name) {
						if (me[name]) {
							if (typeof me[name] == 'function') me[name](key.object, me.elements);
						} else {
							console.warn("IReturBeli.prototype." + name + " is " + me[name]);
						}
					});

				if (key.events)
					key.events.forEach(function (name) {

						if (me[name]) {
							if (typeof me[name] == 'function') me[name](key.object, me.elements);
						} else {
							console.warn("IReturBeli.prototype." + name + " is " + me[name]);
						}
					});

				return me.elements;
			}
		}
	}
};

IReturBeli.prototype.confInputTax = function (object, elements) {
	var me = this;
	object.val(10);
	object.data("value", 10);
};

IReturBeli.prototype.confInputInternal = function (object, elements) {
	var me = this;
	object.val($('span#contact').html());
	object.data("value", Profile.internal.id_internal);
};

IReturBeli.prototype.confInputOrderNumb = function (object, elements) {
	var me = this;
	var z = setInterval(function () {
		if (me.data.purchase_bill) {
			clearInterval(z);
			object.autocomplete({
				lookup  : me.data.purchase_bill,
				onSelect: function (suggestion) {
					if (suggestion["fk.id_purchase_bill"])
						Ajax('get', './server/custom/purchase_bill_ex?id_purchase_bill=' + suggestion["fk.id_purchase_bill"], {}, function (jqXHR, success, data) {
							if ((typeof data == "object") && (data.length > 0)) {
								me.insertTable(data);
							}
						});
				}
			});
		}
	}, 200)
};

IReturBeli.prototype.confInputDateTrans = function (object, elements) {
	var me = this;
	object.datepicker({
		weekStart         : 1,
		language          : "id",
		format            : "yyyy-mm-dd",
		daysOfWeekDisabled: "0",
		startDate         : me.date,
		multidate         : false,
		autoclose         : true,
	});
	object.datepicker('update', me.date);
};

IReturBeli.prototype.confTableOrderPembelian = function (object, elements) {
	var me = this;
	object.find("tbody").html("");
	object.closest("div[panel]").closest('div.panel.panel-danger').find("a").trigger("click");
};

IReturBeli.prototype.clickBtnShowConNew = function (object, elements) {
	var me = this;
	object.off('click');
	object.on('click', function () {
		elements.containerSearch.object.hide();
		elements.containerNew.object.show();
	});
};

IReturBeli.prototype.clickBtnShowConSearch = function (object, elements) {
	var me = this;
	object.off('click');
	object.on('click', function () {
		elements.containerNew.object.hide();
		elements.containerSearch.object.show();
	});
};

IReturBeli.prototype.clickBtnResetTrans = function (object, elements) {
	var me = this;
	object.off('click');
	object.on('click', function () {
		me.module.find('input[id][type!="button"][id!="inputDateTrans"]').val("");
		me.module.find('textarea[id]').val("");
		me.module.find('span[id]').html(0);
		me.confInputDateTrans(me.module.find("input#inputDateTrans"), elements);

		me.prepare();
	});
};

IReturBeli.prototype.clickBtnSubmitTrans = function (object, elements) {
	var me = this;
	object.off('click');
	object.on('click', function () {
		var valid = me.validate(elements);
		if (valid[0].indexOf(false) == -1) {

			object.off('click'); //please wait! don't clicking again!
			AjaxSync("post", "./server/api/purchase_return", {
				"id_purchase_return": elements.inputTransNumb.object.data("value"),
				"datetime"          : elements.inputDateTrans.object.val(),
				"fk.id_internal"    : elements.inputInternal.object.data("value"),
				"active"            : "1",
				"notes"             : elements.textareaNotes.object.data("value")
			}, function (jqXHR, b, c) {
				//console.log(jqXHR.responseJSON);
				if (jqXHR.responseJSON.success) {
					rows = elements.tableOrderPembelian.object.find('tbody>tr');

					$.each(rows, function (i, row) {
						date = new Date();

						if ($(row).data("id_product") && (parseFloat($(row).data("check")) > 0)) {
							row = $(row).data();
							AjaxSync("post", "./server/api/purchase_return_ex", {
								"fk.id_purchase_return" : elements.inputTransNumb.object.data("value"),
								"fk.id_purchase_bill_ex": row["id_purchase_bill_ex"],
								"qty"                   : parseFloat(row.check),
								"active"                : "1"
							}, function (jqXHR, b, c) {
								if (i == rows.length - 1) {
									alert("[Success : 001] Data tersimpan!");
									elements.btnResetTrans.object.trigger('click');
								}
							})
						}
					})
				}
			});
		} else {
			console.log(valid);
			alert("[Warning : 001] Maaf data anda tidak valid!");
		}
	});
};

IReturBeli.prototype.defaultValue = function (elements) {
	elements.inputOrderNumb.object.attr('disabled', "");
};

IReturBeli.prototype.inputSetDataValue = function (object, elements) {
	var me = this;
	object.off('input');
	object.on('input', function () {
		object.data("value", object.val());
		me.calculate(elements);
	});
};

IReturBeli.prototype.changeInputTransNumb = function (object, elements) {
	var me = this;
	object.off('input');
	object.on('input', function () {
		object.parent().removeClass("has-success");
		object.parent().addClass("has-error");
		object.data({
			"valid": false,
			"value": undefined
		});
		elements.inputOrderNumb.object.attr('disabled', "");

		if (object.val()) {
			Ajax('get', './server/api/purchase_return/' + object.val(), {}, function (jq, res, data) {
				if (data.length == 0) {
					object.parent().removeClass("has-error");
					object.parent().addClass("has-success");
					object.data({
						"valid": true,
						"value": object.val()
					});

					elements.inputOrderNumb.object.removeAttr('disabled');

					Ajax('get', './server/custom/purchase_bill', {}, function (jqXHR, success, data) {
						if ((typeof data == "object") && (data.length > 0)) {
							me.data.purchase_bill = data;
							data.forEach(function (raw, i) {
								raw.value = raw["fk.id_purchase_bill"];
								raw.data = raw["fk.id_purchase_bill"];
							});
							me.confInputOrderNumb(elements.inputOrderNumb.object, elements)
						}
					});
				}
			})
		}
	});
};

IReturBeli.prototype.insertTable = function (dataArr) {
	var me = this;
	var table = me.elements.tableOrderPembelian.object;
	var tbody = table.find('tbody');
	var tr = table.find('tbody>tr').length + 1;
	dataArr.forEach(function (data, i) {
		var uuid = data["id_purchase_bill_ex"];

		if (tbody.find("#" + uuid).length == 0) {
			var trans = data["fk.id_purchase_bill"];
			var code = data["id_product"];
			var name = data["name_product"];
			var qty = parseFloat(data["available"]);
			var sum_qty = parseFloat(data["qty_"]);
			var harga = parseFloat(data["harga_beli"]);

			if (qty > 0) {
				var str = "<tr id=" + uuid + ">" +
					"<td align='center'>" + tr++ + "</td>" +
					"<td align='left'>" + trans + "</td>" +
					"<td align='left'>" + code + "</td>" +
					"<td align='left'>" + name + "</td>" +
					"<td align='center'>" + qty + "</td>" +
					"<td align='center'>" + sum_qty + "</td>" +
					"<td align='center'><input type='number' style='width: 60px;' min=0 max=" + qty + " value=" + 0 + "></td>" +
					"<td align='right'>" + harga + "</td>" +
					"<td align='center'><input type='button' class='btn btn-sm btn-danger' value='Hapus'></td>" +
					"</tr>";

				data.check = 0;

				tbody.append(str);

				//Add an event click button on collumn
				tbody.find('input[type="button"]').off('click');
				tbody.find('input[type="button"]').on('click', function (event) {
					$(event.target).closest('tr').remove();

					me.calculate(me.elements);
					$.each(tbody.find("tr"), function (i, tr) {
						var row = $(tr).children().get(0);
						$(row).html(i + 1);
					});
				});

				//Add an event change input number on collumn
				tbody.find('input[type="number"]').off('input');
				tbody.find('input[type="number"]').on('input', function (event) {
					var input = $(event.target);
					var parent = input.closest('tr');
					var maxVal = parent.data("available");

					if ((parseFloat(input.val()) < 0) || isNaN(parseFloat(input.val()))) {
						input.val(0);
						input.data({
							value: 0,
							valid: true
						})
					} else if (parseFloat(input.val()) > maxVal) {
						input.val(maxVal);
						input.data({
							value: maxVal,
							valid: true
						})
					} else {
						input.val(parseFloat(input.val()));
						input.data({
							value: parseFloat(input.val()),
							valid: true
						})
					}

					var qty = parseFloat(input.data("value"));
					var harga = parseFloat(data["harga_beli"]);

					parent.data("check", input.data("value"));

					me.calculate(me.elements);
				});

				var x = 1, z = setInterval(function () {
					if (tbody.find("#" + uuid).length == 1) {
						clearInterval(z);

						tbody.find("#" + uuid).data(data);
						me.calculate(me.elements);
					}
					x++;
				}, 200);
			}
		}
	});
};

IReturBeli.prototype.calculate = function (elements) {
	var me = this;
	var products = [];
	var data = [];
	var check = 0;

	elements.inputTotalQty.object.html(0);
	elements.inputTotalItems.object.html(0);

	$.each(elements.tableOrderPembelian.object.find('tbody>tr'), function (i, tr) {
		var id = $(tr).attr('id');
		var data = $(tr).data();

		check += data.check;
		products.push(data["id_product"]);

		elements.inputTotalQty.object.html(check);
		elements.inputTotalItems.object.html(products.getUnique().length);
	});
};

IReturBeli.prototype.validate = function (elements) {
	var arr = [false, false, false, false];
	var valid = {
		inputTransNumb     : elements.inputTransNumb.object,
		inputDateTrans     : elements.inputDateTrans.object,
		inputInternal      : elements.inputInternal.object,
		tableOrderPembelian: elements.tableOrderPembelian.object.find('tbody>tr')
	};

	if (valid.inputTransNumb.data("valid")) arr[0] = true;
	if (valid.inputDateTrans.data()) arr[1] = true;
	if (valid.inputInternal.data("value")) arr[2] = true;
	if (valid.tableOrderPembelian.length > 0) {
		if (parseFloat(valid.tableOrderPembelian.data("check")) > 0) arr[3] = true;
	}

	return [arr, valid];
};

$(document).ready(function () {
	var iReturBeli = new IReturBeli();
	iReturBeli.initialize();
});