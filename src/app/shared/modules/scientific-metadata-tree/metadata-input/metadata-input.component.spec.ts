import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { FormatNumberPipe } from "shared/pipes/format-number.pipe";
import { Type } from "../base-classes/metadata-input-base";
import { FlatNodeEdit } from "../tree-edit/tree-edit.component";

import { MetadataInputComponent } from "./metadata-input.component";

describe("MetadataInputComponent", () => {
  let component: MetadataInputComponent;
  let fixture: ComponentFixture<MetadataInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MetadataInputComponent],
      imports: [
        MatAutocompleteModule,
      ],
      providers: [FormBuilder, FormatNumberPipe]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataInputComponent);
    component = fixture.componentInstance;
    const data = new FlatNodeEdit();
    data.key = "key";
    data.value = "value";
    data.unit = null;
    data.level = 0;
    data.visible = true;
    data.expandable = false;
    component.data = data;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  describe("#initilizeFormControl()", () => {
    it("should initialize form control with empty string", () => {
      const formControl = component.initilizeFormControl();
      expect(formControl.get("type").value).toEqual("");
      expect(formControl.get("key").value).toEqual("");
      expect(formControl.get("value").value).toEqual("");
      expect(formControl.get("unit").value).toEqual("");
    });
  });
  describe("#addCurrentMetadata()", () => {
    it("should set values in form control (parent node)", () => {
      const data = new FlatNodeEdit();
      data.key = "motor";
      data.visible = true;
      data.expandable = true;
      component.data = data;
      component.initilizeFormControl();
      component.addCurrentMetadata(component.data);
      expect(component.metadataForm.get("type").value).toEqual("string");
      expect(component.metadataForm.get("key").value).toEqual("motor");
      expect(component.metadataForm.get("value").disabled).toEqual(true);
      expect(component.metadataForm.get("unit").disabled).toEqual(true);
    });
    it("should set values in form control (physical quantity)", () => {
      const data = new FlatNodeEdit();
      data.key = "energy";
      data.value = 3;
      data.unit = "joule";
      data.level = 0;
      data.visible = true;
      data.expandable = false;
      component.data = data;
      component.data = data;
      component.initilizeFormControl();
      component.addCurrentMetadata(component.data);
      expect(component.metadataForm.get("type").value).toEqual("quantity");
      expect(component.metadataForm.get("key").value).toEqual("energy");
      expect(component.metadataForm.get("value").value).toEqual(3);
      expect(component.metadataForm.get("unit").value).toEqual("joule");
    });
    it("should set values in form control (number)", () => {
      const data = new FlatNodeEdit();
      data.key = "energy";
      data.value = 3;
      data.level = 0;
      data.expandable = false;
      component.data = data;
      component.data = data;
      component.initilizeFormControl();
      component.addCurrentMetadata(component.data);
      expect(component.metadataForm.get("type").value).toEqual("number");
      expect(component.metadataForm.get("key").value).toEqual("energy");
      expect(component.metadataForm.get("value").value).toEqual(3);
      expect(component.metadataForm.get("unit").disabled).toEqual(true);
    });
    it("should set values in form control (boolean)", () => {
      const data = new FlatNodeEdit();
      data.key = "boolean";
      data.value = true;
      data.level = 0;
      data.expandable = false;
      component.data = data;
      component.data = data;
      component.initilizeFormControl();
      component.addCurrentMetadata(component.data);
      expect(component.metadataForm.get("type").value).toEqual(Type.boolean);
      expect(component.metadataForm.get("key").value).toEqual("boolean");
      expect(component.metadataForm.get("value").value).toEqual("true");
      expect(component.metadataForm.get("unit").disabled).toEqual(true);
    });
    it("should set values in form control (date)", () => {
      const data = new FlatNodeEdit();
      data.key = "date";
      data.value = new Date("2020-01-02").toISOString();
      data.level = 0;
      data.expandable = false;
      component.data = data;
      component.data = data;
      component.initilizeFormControl();
      component.addCurrentMetadata(component.data);
      expect(component.metadataForm.get("type").value).toEqual(Type.date);
      expect(component.metadataForm.get("key").value).toEqual("date");
      expect(component.metadataForm.get("value").value).toEqual(data.value);
      expect(component.metadataForm.get("unit").disabled).toEqual(true);
    });
  });
  describe("#onSave()", () => {
    it("should emit an cancel event", () => {
      spyOn(component.cancel, "emit");
      spyOn(component.save, "emit");
      component.onSave();
      expect(component.cancel.emit).toHaveBeenCalledTimes(1);
      // Should not emit save event if form is not dirty
      expect(component.save.emit).toHaveBeenCalledTimes(0);
    });
    it("should emit an save event", () => {
      spyOn(component.cancel, "emit");
      spyOn(component.save, "emit");
      component.metadataForm.markAsDirty();
      component.onSave();
      expect(component.cancel.emit).toHaveBeenCalledTimes(0);
      expect(component.save.emit).toHaveBeenCalledTimes(1);
      expect(component.save.emit).toHaveBeenCalledWith(component.metadataForm.value);
    });
  });
  describe("#onCancle()", () => {
    it("should emit an cancel event", () => {
      spyOn(component.cancel, "emit");
      component.onCancel();
      expect(component.cancel.emit).toHaveBeenCalledTimes(1);
    });
  });
});