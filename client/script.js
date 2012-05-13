// Client-side JavaScript, bundled and sent to client.

// Define Minimongo collections to match server/publish.js.
Orders = new Meteor.Collection("orders");

// Name of currently selected tag for filtering
Session.set('tag_filter', null);

// When adding tag to a todo, ID of the todo
Session.set('editing_addtag', null);

// When editing todo text, ID of the todo
Session.set('editing_itemname', null);


// Subscribe to 'lists' collection on startup.
// Select a list once data has arrived.
Meteor.subscribe('lists', function () {
  if (!Session.get('list_id')) {
    var list = Lists.findOne({}, {sort: {name: 1}});
    if (list)
      Router.setList(list._id);
  }
});

// Always be subscribed to the orders for the selected list.
Meteor.autosubscribe(function () {
  var list_id = Session.get('list_id');
  if (list_id)
    Meteor.subscribe('orders', list_id);
});


////////// Helpers for in-place editing //////////

// Returns an event_map key for attaching "ok/cancel" events to
// a text input (given by selector)
var okcancel_events = function (selector) {
  return 'keyup '+selector+', keydown '+selector+', focusout '+selector;
};

// Creates an event handler for interpreting "escape", "return", and "blur"
// on a text field and calling "ok" or "cancel" callbacks.
var make_okcancel_handler = function (options) {
  var ok = options.ok || function () {};
  var cancel = options.cancel || function () {};

  return function (evt) {
    if (evt.type === "keydown" && evt.which === 27) {
      // escape = cancel
      cancel.call(this, evt);

    } else if (evt.type === "keyup" && evt.which === 13 ||
               evt.type === "focusout") {
      // blur/return/enter = ok/submit if non-empty
      var value = String(evt.target.value || "");
      if (value)
        ok.call(this, value, evt);
      else
        cancel.call(this, evt);
    }
  };
};

// Finds a text input in the DOM by id and focuses it.
var focus_field_by_id = function (id) {
  var input = document.getElementById(id);
  if (input) {
    input.focus();
    input.select();
  }
};

////////// Lists //////////

Template.lists.lists = function () {
  return Lists.find({}, {sort: {name: 1}});
};

Template.lists.events = {};

// Attach events to keydown, keyup, and blur on "New list" input box.
Template.lists.events[ okcancel_events('#new-list') ] =
  make_okcancel_handler({
    ok: function (text, evt) {
      var id = Lists.insert({name: text});
      Router.setList(id);
      evt.target.value = "";
    }
  });

Template.list_item.selected = function () {
  return Session.equals('list_id', this._id) ? 'selected' : '';
};

Template.list_item.name_class = function () {
  return this.name ? '' : 'empty';
};

Template.list_item.editing = function () {
  return Session.equals('editing_listname', this._id);
};

Template.list_item.events = {
  'mousedown': function (evt) { // select list
    Router.setList(this._id);
  },
  'dblclick': function (evt) { // start editing list name
    Session.set('editing_listname', this._id);
    Meteor.flush(); // force DOM redraw, so we can focus the edit field
    focus_field_by_id("list-name-input");
  }
};

Template.list_item.events[ okcancel_events('#list-name-input') ] =
  make_okcancel_handler({
    ok: function (value) {
      Lists.update(this._id, {$set: {name: value}});
      Session.set('editing_listname', null);
    },
    cancel: function () {
      Session.set('editing_listname', null);
    }
  });

////////// Orders //////////

Template.orders.any_list_selected = function () {
  return !Session.equals('list_id', null);
};

Template.orders.events = {};

Template.orders.events[ okcancel_events('#new-todo') ] =
  make_okcancel_handler({
    ok: function (text, evt) {
      var tag = Session.get('tag_filter');
      Orders.insert({
        text: text,
        list_id: Session.get('list_id'),
        done: false,
        timestamp: (new Date()).getTime(),
        tags: tag ? [tag] : []
      });
      evt.target.value = '';
    }
  });

Template.orders.orders = function () {
  // Determine which orders to display in main pane,
  // selected based on list_id and tag_filter.

  var list_id = Session.get('list_id');
  if (!list_id)
    return {};

  var sel = {list_id: list_id};
  var tag_filter = Session.get('tag_filter');
  if (tag_filter)
    sel.tags = tag_filter;

  return Orders.find(sel, {sort: {timestamp: 1}});
};

Template.todo_item.tag_objs = function () {
  var todo_id = this._id;
  return _.map(this.tags || [], function (tag) {
    return {todo_id: todo_id, tag: tag};
  });
};

Template.todo_item.done_class = function () {
  return this.done ? 'done' : '';
};

Template.todo_item.done_checkbox = function () {
  return this.done ? 'checked="checked"' : '';
};

Template.todo_item.editing = function () {
  return Session.equals('editing_itemname', this._id);
};

Template.todo_item.adding_tag = function () {
  return Session.equals('editing_addtag', this._id);
};

Template.todo_item.events = {
  'click .check': function () {
    Orders.update(this._id, {$set: {done: !this.done}});
  },

  'click .destroy': function () {
    Orders.remove(this._id);
  },

  'click .addtag': function (evt) {
    Session.set('editing_addtag', this._id);
    Meteor.flush(); // update DOM before focus
    focus_field_by_id("edittag-input");
  },

  'dblclick .display .todo-text': function (evt) {
    Session.set('editing_itemname', this._id);
    Meteor.flush(); // update DOM before focus
    focus_field_by_id("todo-input");
  }
};

Template.todo_item.events[ okcancel_events('#todo-input') ] =
  make_okcancel_handler({
    ok: function (value) {
      Orders.update(this._id, {$set: {text: value}});
      Session.set('editing_itemname', null);
    },
    cancel: function () {
      Session.set('editing_itemname', null);
    }
  });

Template.todo_item.events[ okcancel_events('#edittag-input') ] =
  make_okcancel_handler({
    ok: function (value) {
      Orders.update(this._id, {$addToSet: {tags: value}});
      Session.set('editing_addtag', null);
    },
    cancel: function () {
      Session.set('editing_addtag', null);
    }
  });

Template.todo_tag.events = {
  'click .remove': function (evt) {
    var tag = this.tag;
    var id = this.todo_id;

    evt.target.parentNode.style.opacity = 0;
    // wait for CSS animation to finish
    Meteor.setTimeout(function () {
      Orders.update({_id: id}, {$pull: {tags: tag}});
    }, 300);
  }
};

////////// Tag Filter //////////

// Pick out the unique tags from all orders in current list.
Template.tag_filter.tags = function () {
  var tag_infos = [];
  var total_count = 0;

  Orders.find({list_id: Session.get('list_id')}).forEach(function (todo) {
    _.each(todo.tags, function (tag) {
      var tag_info = _.find(tag_infos, function (x) { return x.tag === tag; });
      if (! tag_info)
        tag_infos.push({tag: tag, count: 1});
      else
        tag_info.count++;
    });
    total_count++;
  });

  tag_infos = _.sortBy(tag_infos, function (x) { return x.tag; });
  tag_infos.unshift({tag: null, count: total_count});

  return tag_infos;
};

Template.tag_item.tag_text = function () {
  return this.tag || "All items";
};

Template.tag_item.selected = function () {
  return Session.equals('tag_filter', this.tag) ? 'selected' : '';
};

Template.tag_item.events = {
  'mousedown': function () {
    if (Session.equals('tag_filter', this.tag))
      Session.set('tag_filter', null);
    else
      Session.set('tag_filter', this.tag);
  }
};

////////// Tracking selected list in URL //////////

var OrdersRouter = Backbone.Router.extend({
  routes: {
    ":list_id": "main"
  },
  main: function (list_id) {
    Session.set("list_id", list_id);
    Session.set("tag_filter", null);
  },
  setList: function (list_id) {
    this.navigate(list_id, true);
  }
});

Router = new OrdersRouter;

Meteor.startup(function () {
  Backbone.history.start({pushState: true});
});