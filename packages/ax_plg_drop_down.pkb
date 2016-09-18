--------------------------------------------------------
--  DDL for Package Body AX_PLG_DROP_DOWN
--------------------------------------------------------

  CREATE OR REPLACE PACKAGE BODY "AX_PLG_DROP_DOWN" as

    gv_playground_host varchar2(100) := 'PLAYGROUND';
    
    function f_is_playground return boolean is 
    v_ax_workspace varchar2(200);
    begin
        select apex_util.find_workspace((select apex_application.get_security_group_id from dual))
          into v_ax_workspace 
          from dual;
          
        if  gv_playground_host = v_ax_workspace then
            return true;
        else 
            return false;
        end if;
    end f_is_playground; 
    
    function is_numeric(p_value varchar2) return number is
        v_new_num number;
    begin
        v_new_num := to_number(p_value);
        return 1;
    exception
    when others then
        return 0;     
    end is_numeric;
    
    
    function prepare_url(p_page_num varchar, p_app_num number default null) return varchar2 is
     v_app             number := v('APP_ID');
     v_session         number := v('APP_SESSION');
     v_debug           varchar2(10) := v('DEBUG');
    begin
       if p_app_num is not null then
         v_app := p_app_num;
       end if;
       
        return apex_util.prepare_url(
               p_url => 'f?p=' || v_app || ':' || p_page_num || ':'||v_session||'::'|| v_debug || '::',
               p_checksum_type => 'SESSION');    
       
    end prepare_url;
    
    function get_page_id_from_list_entry(p_url varchar2) return number is
    begin
        return    regexp_substr(p_url, 'f\?p=&APP_ID\.:(\d+).*', 1, 1, 'i', 1);
    end get_page_id_from_list_entry;
    
    
    function dropdown_button (
        p_dynamic_action      in apex_plugin.t_dynamic_action,
        p_plugin              in apex_plugin.t_plugin        
    ) return apex_plugin.t_dynamic_action_render_result is
     --
     v_result          apex_plugin.t_dynamic_action_render_result;
     v_eleBtnSelector  varchar2(200);
     v_list_values     varchar2(32767);
     --
     v_exe_code        clob;
     v_list            clob;
     --     
     v_static_list     wwv_flow_global.vc_arr2;
     v_value           varchar2(32767);
     v_display         varchar2(32767);
     TYPE t_value IS TABLE OF t_values INDEX BY BINARY_INTEGER;
     v_tab_values     t_value;
     --
     v_app             number := v('APP_ID');     
     v_type            varchar2(100);
     v_list_name       varchar2(100);
     v_query           clob;
     v_page_num        varchar2(200);
    begin
       v_query          := p_dynamic_action.attribute_01;
       v_type           := p_dynamic_action.attribute_02;
       v_page_num       := p_dynamic_action.attribute_04;
       v_eleBtnSelector := p_dynamic_action.attribute_05;
       v_list_name      := p_dynamic_action.attribute_07;
       
       
       -- parse static2 value
       v_list_values    := p_dynamic_action.attribute_03;
       
       if upper(substr(v_list_values,1,6)) = 'STATIC' then
          v_list_values := substr(v_list_values,8);
       elsif upper(substr(v_list_values,1,6)) = 'STATIC2' then
          v_list_values := substr(v_list_values,9);
       else
          v_list_values := v_list_values;
       end if;
       
       apex_json.initialize_clob_output;
       apex_json.open_object;                                          -- {
       apex_json.write('btnIcon', p_dynamic_action.attribute_06);      --   "btnIcon":  fa-bars
       apex_json.open_array('list');                                   --  ,"list":[
           
       if v_type = 'STATIC' then
           v_static_list    := wwv_flow_utilities.string_to_table2(v_list_values,',');
           
           for i in 1..v_static_list.count loop
           
             if instr(v_static_list(i),';') > 0 then
                v_value   := substr(v_static_list(i),  instr(v_static_list(i),';')+1);
                v_display := substr(v_static_list(i),1,instr(v_static_list(i),';')-1);
             else
                v_value   := v_static_list(i);
                v_display := v_static_list(i);
             end if;
             
             if instr(v_value, 'http') = 0 and is_numeric(v_value) =1 then
                v_value := prepare_url(v_value);
             end if;
             
             
             apex_json.open_object;                  -- {
             apex_json.write('value', v_value  );    --   "value":  xxx
             apex_json.write('text' , v_display);    --   "v_display":  xxx
             apex_json.close_object;                 -- }
             
           end loop;
           
          
       elsif v_type = 'LIST' then
               for i in( select entry_text
                               ,entry_target
                           from apex_application_list_entries
                          where application_id = v_app
                            and list_name      = v_list_name) loop
                             apex_json.open_object;       
                             
                             v_value := i.entry_target;
                             
                             if instr(v_value, 'http') = 0 and
                                get_page_id_from_list_entry(v_value) is not null then
                                v_value := get_page_id_from_list_entry(v_value);
                                v_value := prepare_url(v_value);
                             end if;
                             
                             apex_json.write('value',  v_value        );    --   "value":  xxx
                             apex_json.write('text' ,  i.entry_text    );    --   "v_display":  xxx
                             apex_json.close_object;                        -- }
              end loop;
       elsif v_type = 'SQL_QUERY' then
            execute immediate v_query bulk collect into v_tab_values;
            for indx in nvl (v_tab_values.first, 0) .. nvl (v_tab_values.last, -1)
            loop
                 apex_json.open_object;       
                             
                 v_value := v_tab_values(indx).link_value;
                 if instr(v_value, 'http') = 0 and
                    is_numeric(v_value)    = 1 then                    
                    v_value := prepare_url(v_value);
                 end if;
                 
                 apex_json.write('value',  v_value                            );    --   "value":  xxx
                 apex_json.write('text' , v_tab_values(indx).display_value    );    --   "v_display":  xxx
                 apex_json.close_object;
            end loop;
       elsif v_type = 'PAGE_NUMBERS' then
            v_static_list    := wwv_flow_utilities.string_to_table2(v_page_num,',');
       
              for i in 1..v_static_list.count loop
                select max(page_title)
                  into v_display
                  from apex_application_pages 
                 where page_id = v_static_list(i);
                 
                 v_value := v_static_list(i);
                 v_value := prepare_url(v_value);
                 
                 apex_json.open_object;
                 apex_json.write('value',  v_value    );    --   "value":  xxx
                 apex_json.write('text' , v_display   );    --   "v_display":  xxx
                 apex_json.close_object;
                 
             end loop;
       end if;
       
       apex_json.close_array;                    -- ]
       apex_json.close_object;                   -- } 
       
       v_list := apex_json.stringify(apex_json.get_clob_output);
       apex_json.free_output;
             
       if f_is_playground = false then
           apex_javascript.add_library(p_name           => 'dropdown.button',
                                       p_directory      => p_plugin.file_prefix,
                                       p_version        => NULL,
                                       p_skip_extension => FALSE);
          
           apex_javascript.add_library(p_name           => 'handlebars-v4.0.5',
                                       p_directory      =>  p_plugin.file_prefix,
                                       p_version        => NULL,
                                       p_skip_extension => FALSE);
           apex_css.add_file (
                        p_name      => 'dropdown.button',
                        p_directory => p_plugin.file_prefix );
       end if;
        
       v_exe_code := ' new apex.plugins.dropDownButton({' ||
            'eleBtnSelector   :"'  || v_eleBtnSelector  || '",' ||
            'config           :'   || v_list            ||  
       ' });';
       
       apex_javascript.add_onload_code(
          p_code => v_exe_code
       );
    
       v_result.javascript_function := 'null';
            
      
       return v_result;
          
    end dropdown_button;

end ax_plg_drop_down;

/
