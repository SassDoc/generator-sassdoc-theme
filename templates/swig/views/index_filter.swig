<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>Your SassDoc Theme</title>
        <link rel="stylesheet" href="assets/css/main.css" />

        {##
         # Feel free to add more meta or stylesheets. It's up to you.
         #}
    </head>

    <body>

    {##
     # You can access any variable you set in your configuration file from the `view` object.
     # Basically your configuration file is passed to the view as the `view` object.
     #}
    {{ view.test_variable }}

    {##
     # Groups usually have quite unfriendly names, hence `undefined`. Fortunately, they can be aliased
     # from the configuration file of the theme. Then, SassDoc processes it to generate a `groups` object.
     # In this object, each group name is mapped to either an alias if specified in the configuration file
     # or the same group name. For instance:
     #
        groups = {
            'undefined': 'My Awesome Default Group'
        }
     #
     # To retrieve the alias of a group, use `groups[group_name]`. In this case, `groups['undefined']` will
     # return `My Awesome Default Group`.
     #}

    {##
     # To display our items, we need to:
     # 1. Loop over `data` types
     # 2. Loop over items mapped to each type
     #}

    {# 1. Loop over the types in `data` #}
    {% for type, items in data %}
      {# If items to be displayed in type #}
      {% if items.length > 0 %}
      <section>
          <h2>{{ type }}</h2>

          {# 2. Loop over the items in the current type #}
          {% for item in items %}

          {# At this point it is up to you to display whatever you want from your items. #}
          <h3>{{ item.context.name }}</h3>

          <p>This item belongs to group {{ groups[item.group[0][0]] }}.</p>

          {% endfor %}
      </section>
      {% endif %}

    {% endfor %}

    {##
     # If your theme needs some JavaScript, feel free to create a JS file in `assets/js/` folder
     # and include it as follow:
     #
        <script src="assets/js/main.js"></script>
     #
     #}

    </body>
</html>
