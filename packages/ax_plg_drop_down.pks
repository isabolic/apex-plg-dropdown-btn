--------------------------------------------------------
--  DDL for Package AX_PLG_DROP_DOWN
--------------------------------------------------------

  CREATE OR REPLACE PACKAGE "AX_PLG_DROP_DOWN" as
 type t_values is record (
      display_value         varchar2(4000)
     ,link_value            varchar2(4000)
    );
 function dropdown_button (
        p_dynamic_action      in apex_plugin.t_dynamic_action,
        p_plugin              in apex_plugin.t_plugin
    ) return apex_plugin.t_dynamic_action_render_result;

end ax_plg_drop_down;

/
